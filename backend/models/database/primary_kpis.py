from models.database.base import Base
from sqlalchemy import Column, Integer, String


class PrimaryKPI(Base):
    """
    PrimaryKPI model represents the primary key performance indicators in the database.
    It extends the base class from SQLAlchemy's declarative base.
    """
    __tablename__ = 'primary_kpis'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    alias = Column(String, nullable=True)  # Added alias column

    def __repr__(self):
        return f"<PrimaryKPI(id={self.id}, name='{self.name}', alias='{self.alias}')>"
