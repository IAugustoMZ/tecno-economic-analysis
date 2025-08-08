from models.database.base import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey

class Project(Base):
    """
    Project model represents the projects in the database.
    It extends the base class from SQLAlchemy's declarative base.
    """
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_name = Column(String, nullable=False)
    project_description = Column(String, nullable=True)
    plant_capacity = Column(Float, nullable=True)
    discount_rate = Column(Float, nullable=True)
    project_duration = Column(Integer, nullable=True)
    total_equipment_cost = Column(Float, nullable=False)
    total_utility_cost = Column(Float, nullable=False)
    product_selling_price = Column(Float, nullable=False)
    primary_kpi_id = Column(Integer, ForeignKey('primary_kpis.id'), nullable=False)

    def __repr__(self):
        return (f"<Project(id={self.id}, project_name='{self.project_name}', "
                f"project_description='{self.project_description}', plant_capacity={self.plant_capacity}, "
                f"discount_rate={self.discount_rate}, project_duration={self.project_duration}, "
                f"primary_kpi_id={self.primary_kpi_id})>")