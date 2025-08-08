from pydantic import BaseModel
from typing import Optional, Dict, Any

class NewProjectSchema(BaseModel):
    id: Optional[int] = None
    project_name: str
    project_description: Optional[str] = None
    plant_capacity: Optional[float] = None
    discount_rate: Optional[float] = None
    project_duration: Optional[int] = None
    primary_kpi_id: int
    total_equipment_cost: float
    total_utility_cost: float
    product_selling_price: float

    class Config:
        from_attributes = True

class AvailableProjectSchema(BaseModel):
    id: int
    project_name: str
    project_description: Optional[str] = None
    plant_capacity: Optional[float] = None
    discount_rate: Optional[float] = None
    project_duration: Optional[int] = None
    primary_kpi: Dict[str, Any] = {}
    total_equipment_cost: float
    total_utility_cost: float
    product_selling_price: float

    class Config:
        from_attributes = True