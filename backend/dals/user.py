from sqlalchemy.ext.asyncio import AsyncSession

from db.alchemyModels import User


class UserDAL:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_user(self, email: str) -> User:
        new_user = User(email=email)
        self.db_session.add(new_user)
        await self.db_session.flush()
        return new_user
