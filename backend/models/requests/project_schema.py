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

    class Config:
        from_attributes = True