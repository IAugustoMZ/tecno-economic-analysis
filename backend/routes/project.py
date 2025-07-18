from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from controller.database import DatabaseHandler

# create a fastapi router
router = APIRouter()

def get_db_handler():
    """
    Dependency function to get a DatabaseHandler instance.
    """
    return DatabaseHandler()

@router.get("/primary-kpis")
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