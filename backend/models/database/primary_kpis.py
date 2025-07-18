from sqlalchemy import Column, Integer, String
from auth.database import DatabaseConnectionHandler

# instance of database connection handler
db_handler = DatabaseConnectionHandler()

class PrimaryKPI(db_handler.base):
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
