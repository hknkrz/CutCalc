import copy
import logging
from collections import Counter
from functools import partial
from typing import List, Tuple

import numpy as np
import numpy.random as rnd
from alns import ALNS
from alns.accept import HillClimbing
from alns.select import RouletteWheel
from alns.stop import MaxIterations
from viewModels.nesting import Pipe, NestedPipe

SEED = 5432
DEGREE_OF_DESTRUCTION = 0.25


class CspState:
    def __init__(self, assignments, input_pipe_length, unassigned=None):
        self.assignments = assignments
        self.input_pipe_length = input_pipe_length
        self.unassigned = []

        if unassigned is not None:
            self.unassigned = unassigned

    def copy(self):
        return CspState(assignments=copy.deepcopy(self.assignments), input_pipe_length=self.input_pipe_length,
                        unassigned=self.unassigned.copy())

    def objective(self):
        return len(self.assignments)


def wastage(assignment, input_pipe_length):
    return input_pipe_length - sum(assignment)


def beams_to_remove(num_beams):
    return int(num_beams * DEGREE_OF_DESTRUCTION)


def random_removal(state, random_state):
    state = state.copy()

    for _ in range(beams_to_remove(state.objective())):
        idx = random_state.randint(state.objective())
        state.unassigned.extend(state.assignments.pop(idx))

    return state


def worst_removal(state, random_state):
    state = state.copy()

    # Sort assignments by wastage, worst first
    state.assignments.sort(key=partial(wastage, input_pipe_length=state.input_pipe_length), reverse=True)

    # Removes the worst assignments
    for _ in range(beams_to_remove(state.objective())):
        state.unassigned.extend(state.assignments.pop(0))

    return state


def minimal_wastage(state, random_state):
    def insertion_cost(assignment, beam, input_pipe):  # helper method for min
        if beam <= wastage(assignment, input_pipe):
            return wastage(assignment, input_pipe) - beam

        return float("inf")

    while len(state.unassigned) != 0:
        beam = state.unassigned.pop(0)

        assignment = min(state.assignments,
                         key=partial(insertion_cost, beam=beam, input_pipe=state.input_pipe_length))

        if beam <= wastage(assignment, input_pipe_length=state.input_pipe_length):
            assignment.append(beam)
        else:
            state.assignments.append([beam])

    return state


def greedy_insert(state, random_state):
    random_state.shuffle(state.unassigned)

    while len(state.unassigned) != 0:
        beam = state.unassigned.pop(0)

        for assignment in state.assignments:
            if beam <= wastage(assignment, input_pipe_length=state.input_pipe_length):
                assignment.append(beam)
                break
        else:
            state.assignments.append([beam])

    return state


def heuristic_nesting(input_pipe_length: int, output_pipes: List[int]) -> List[List[int]]:
    rnd_state = rnd.RandomState(SEED)

    state = CspState(assignments=[], unassigned=[x for x in output_pipes if x <= input_pipe_length],
                     input_pipe_length=input_pipe_length)
    init_sol = greedy_insert(state, rnd_state)

    alns = ALNS(rnd_state)

    alns.add_destroy_operator(random_removal)
    alns.add_destroy_operator(worst_removal)

    alns.add_repair_operator(greedy_insert)
    alns.add_repair_operator(minimal_wastage)
    accept = HillClimbing()
    select = RouletteWheel([3, 2, 1, 0.5], 0.8, 2, 2)
    stop = MaxIterations(5_000)

    result = alns.iterate(init_sol, select, accept, stop)
    solution = result.best_state
    return solution.assignments


def calculate_nesting(_input_pipes: List[Pipe], _output_pipes: List[Pipe]) -> Tuple[
    List[NestedPipe], List[Pipe], List[Pipe]]:
    output_pipes = []
    [output_pipes.extend([x.length] * x.quantity) for x in _output_pipes]
    input_counter = Counter({x.length: x.quantity for x in _input_pipes})
    output_counter = Counter({x.length: x.quantity for x in _output_pipes})
    input_pipes = [x for x in input_counter.keys()]
    result_nesting_map = []
    input_checksum = sum(input_counter.values())
    while output_counter:
        full_nesting_map = []
        for pipe in input_pipes:
            full_nesting_map.extend(
                [(pipe, x) for x in heuristic_nesting(output_pipes=output_pipes, input_pipe_length=pipe)])
        for nested_pipe in sorted(full_nesting_map, key=lambda x: (-max(x[1]), x[0] - sum(x[1]))):
            nested_pipe_output_counter = Counter(nested_pipe[1])
            nested_pipe_input_counter = Counter([nested_pipe[0]])
            if output_counter >= nested_pipe_output_counter and input_counter >= nested_pipe_input_counter:
                output_counter -= nested_pipe_output_counter
                input_counter -= nested_pipe_input_counter
                result_nesting_map.append((nested_pipe[0], tuple(nested_pipe[1])))
        if not output_counter:
            break
        if not input_counter:
            logging.info("Not enough initial workpieces")
            break
        if input_checksum == sum(input_counter.values()):
            logging.info("Not used workpieces from previous iteration")
            break
        input_checksum = sum(input_counter.values())
        input_pipes = [x for x in input_counter.keys()]

    nesting_map_counter = Counter(tuple(t) for t in result_nesting_map)
    nested_pipe_list = [NestedPipe(length=nested_pipe[0], cut_positions=np.cumsum(nested_pipe[1]), quantity=quantity)
                        for
                        nested_pipe, quantity in nesting_map_counter.items()]

    input_counter_list = [Pipe(length=length, quantity=quantity) for length, quantity in input_counter.items()]
    output_counter_list = [Pipe(length=length, quantity=quantity) for length, quantity in output_counter.items()]

    return nested_pipe_list, input_counter_list, output_counter_list
