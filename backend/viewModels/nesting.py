from typing import List

from pydantic import BaseModel


class Pipe(BaseModel):
    length: int
    quantity: int
    name: str = None


class NestedPipe(BaseModel):
    length: int
    cut_positions: List[int]
    quantity: int


class CalculateNesting(BaseModel):
    input_pipes: List[Pipe]
    output_pipes: List[Pipe]
    blade_width: float = 0


class ViewNesting(BaseModel):
    nesting_map: List[NestedPipe]
    unused_pipes: List[Pipe]
    uncut_pipes: List[Pipe]
    wastes: float = 0
    cut_points: int = 0
