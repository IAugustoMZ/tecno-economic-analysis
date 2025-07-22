import json
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from models.database.project import Project
from controller.database import DatabaseHandler
from models.requests.project_schema import NewProjectSchema, AvailableProjectSchema

# create a fastapi router
router = APIRouter()

def get_db_handler():
    """
    Dependency function to get a DatabaseHandler instance.
    """
    return DatabaseHandler()

@router.get("/get-primary-kpis")
async def get_primary_kpis(db: DatabaseHandler = Depends(get_db_handler)):
    """
    Endpoint to get primary KPIs from the database.

    Parameters:
    -----------
    db : DatabaseHandler
        The database handler dependency.

    Returns:
    --------
    dict
        The primary KPIs data.
    """
    kpis = db.get_all_primary_kpis()
    return JSONResponse(content={"primary_kpis": kpis})

@router.post("/new-project", response_model=NewProjectSchema)
async def create_project(
    project: NewProjectSchema, db: DatabaseHandler = Depends(get_db_handler)
):
    """
    Endpoint to create a new project in the database.

    Parameters:
    -----------
    project : Project
        The project data to be created.
    db : DatabaseHandler
        The database handler dependency.

    Returns:
    --------
    dict
        The created project data.
    """
    try:
        # convert ProjectSchema to Project model
        project_data = project.dict()
        project = Project(**project_data)
        
        # add project to the database
        db.add_project(project)

        # ensure project is JSON serializable
        project_dict = {k: v for k, v in project.__dict__.items() if not k.startswith('_')}
        return JSONResponse(content={
            "message": "Project created successfully",
            "project": project_dict
        }, status_code=201)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.get("/get-available-projects", response_model=list[AvailableProjectSchema])
async def get_available_projects(db: DatabaseHandler = Depends(get_db_handler)):
    """
    Endpoint to get all available projects with their primary KPI names.

    Parameters:
    -----------
    db : DatabaseHandler
        The database handler dependency.

    Returns:
    --------
    list
        List of available projects with primary KPI names.
    """
    try:
        projects = db.get_all_projects()
        available_projects = []
        for project in projects:
            primary_kpi_id = project.get("primary_kpi_id")
            primary_kpi_name = db.get_primary_kpi_name_by_id(primary_kpi_id) if primary_kpi_id else None
            project_dict = {k: v for k, v in project.items() if k != "primary_kpi_id"}
            project_dict["primary_kpi"] = {
                "id": primary_kpi_id,
                "name": primary_kpi_name
            }
            available_projects.append(project_dict)
        return JSONResponse(content=available_projects, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.delete("/delete-project/{project_id}")
async def delete_project(project_id: int, db: DatabaseHandler = Depends(get_db_handler)):
    """
    Endpoint to delete a project by its ID.

    Parameters:
    -----------
    project_id : int
        The ID of the project to delete.
    db : DatabaseHandler
        The database handler dependency.

    Returns:
    --------
    dict
        Success or error message.
    """
    try:
        db.delete_project_by_id(project_id)
        return JSONResponse(content={"message": "Project deleted successfully"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.patch("/update-project/{project_id}", response_model=NewProjectSchema)
async def update_project(
    project_id: int,
    project: NewProjectSchema,
    db: DatabaseHandler = Depends(get_db_handler)
):
    """
    Endpoint to update an existing project by its ID.

    Parameters:
    -----------
    project_id : int
        The ID of the project to update.
    project : NewProjectSchema
        The updated project data.
    db : DatabaseHandler
        The database handler dependency.

    Returns:
    --------
    dict
        The updated project data or error message.
    """
    try:
        project_data = project.dict()
        updated_project = Project(**project_data)
        db.update_project_by_id(project_id, updated_project)
        project_dict = {k: v for k, v in updated_project.__dict__.items() if not k.startswith('_')}
        return JSONResponse(content={
            "message": "Project updated successfully",
            "project": project_dict
        }, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
    
@router.get("/get-project/{project_id}", response_model=AvailableProjectSchema)
async def get_project_by_id(project_id: int, db: DatabaseHandler = Depends(get_db_handler)):
    """
    Endpoint to get a project by its ID.

    Parameters:
    -----------
    project_id : int
        The ID of the project to retrieve.
    db : DatabaseHandler
        The database handler dependency.

    Returns:
    --------
    dict
        The project data or error message.
    """
    try:
        project = db.get_project_by_id(project_id)
        if not project:
            return JSONResponse(content={"error": "Project not found"}, status_code=404)
        primary_kpi_id = project.get("primary_kpi_id")
        primary_kpi_name = db.get_primary_kpi_name_by_id(primary_kpi_id) if primary_kpi_id else None
        project_dict = {k: v for k, v in project.items() if k != "primary_kpi_id"}
        project_dict["primary_kpi"] = {
            "id": primary_kpi_id,
            "name": primary_kpi_name
        }
        return JSONResponse(content=project_dict, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)