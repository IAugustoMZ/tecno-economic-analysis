from fastapi import APIRouter
from fastapi.responses import JSONResponse

# create a fastapi router
router = APIRouter()

# health endpoint
@router.get("/")
async def health() -> dict:
    """
    health endpoint to check if the service is up and running

    Returns:
    --------
    dict
        the response message
    """
    return JSONResponse(content={"message": "Service is up and running!"})