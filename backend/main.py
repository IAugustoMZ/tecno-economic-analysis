import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import health, project
from controller.database import DatabaseHandler

# setup logging
# instantiate logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

# create FastAPI app
app = FastAPI()

# add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Only allow requests from the host or another container
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add startup event to create tables and populate data
@app.on_event("startup")
async def startup_event():
    """
    Startup event to create tables and populate initial data.
    """
    # create a single instance of DatabaseConnectionHandler
    db_handler = DatabaseHandler()
    try:
        db_handler.create_tables_from_schema()
        db_handler.populate_tables_from_schema()
        logger.info("Database tables created and populated successfully.")
    except Exception as e:
        logger.error(f"Error during startup event: {e}")

# include health check route
app.include_router(health.router, tags=["health"])
app.include_router(project.router, tags=["project"])