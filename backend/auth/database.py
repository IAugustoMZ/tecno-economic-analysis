import os
import yaml
import logging
from config import AppSettings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


# instantiate logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

class DatabaseConnectionHandler:
    def __init__(self):
        """
        Initializes the database connection handler.

        Parameters
        ----------
        config : AppSettings
            Configuration settings for the application, including database file path.
        """
        self.config = AppSettings()
        self.engine = None
        self.session = None
        self.base = declarative_base()

        # load the database schema
        self._load_schema()

        # create connection to the database
        self._create_connection()

    def _load_schema(self):
        """
        Loads the database schema from the models module.
        """
        schema_file_path = os.path.join(self.config.DATABASE_FILE_PATH, 'database_schema.yml')
        if not os.path.exists(schema_file_path):
            logger.error(f"Database schema file not found at {schema_file_path}")
            raise FileNotFoundError(f"Database schema file not found at {schema_file_path}")
        logger.info(f"Loading database schema from {schema_file_path}")

        with open(schema_file_path, 'r') as f:
            self.schema = yaml.safe_load(f)

    def _create_connection(self):
        """
        Creates a connection to the database using SQLAlchemy.
        """
        self.database_name = list(self.schema.keys())[0]
        CONNECTION_STRING = os.path.join(self.config.DATABASE_FILE_PATH, self.database_name + '.db')
        db_url = f"sqlite:///{CONNECTION_STRING}"
        logger.info(f"Creating database connection to {db_url}")

        self.engine = create_engine(db_url)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

        # Create all tables based on the schema
        self.base.metadata.create_all(self.engine)
        logger.info("Database connection established")

    def get_session(self):
        """
        Returns the current database session.

        Returns
        -------
        session : sqlalchemy.orm.Session
            The current database session.
        """
        if self.session is None:
            logger.error("Database session is not initialized.")
            raise Exception("Database session is not initialized.")
        return self.session
    
    def close_session(self):
        """
        Closes the current database session.
        """
        if self.session:
            self.session.close()
            logger.info("Database session closed.")
        else:
            logger.warning("No active database session to close.")