from typing import Union, Dict

from algorithms.heuristic import calculate_nesting
from dals.user import UserDAL
from db.session import async_session
from fastapi import APIRouter
from viewModels.nesting import CalculateNesting, ViewNesting
from viewModels.user import UserCreate, ViewUser
import logging

user_router = APIRouter()
calculate_router = APIRouter()


async def _create_new_user(request: UserCreate) -> ViewUser:
    async with async_session() as session:
        async with session.begin():
            user_dal = UserDAL(session)
            user = await user_dal.create_user(
                email=request.email
            )
            return ViewUser(user_id=user.user_id,
                            email=user.email
                            )


@user_router.post("/", response_model=ViewUser)
async def create_user(request: UserCreate) -> ViewUser:
    return await _create_new_user(request)


@calculate_router.post(path="/", response_model=Union[ViewNesting, Dict])
async def calculate_nesting_handler(request: CalculateNesting) -> ViewNesting:
    logging.info(123)

    nesting_map, unused_pipes, uncut_pipes = calculate_nesting(_input_pipes=request.input_pipes,
                                                               _output_pipes=request.output_pipes)
    return ViewNesting(nesting_map=nesting_map, unused_pipes=unused_pipes, uncut_pipes=uncut_pipes)
