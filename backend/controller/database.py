import logging
from sqlalchemy import text
from models.database.project import Project
from models.database.primary_kpis import PrimaryKPI
from auth.database import DatabaseConnectionHandler

# instantiate logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

class DatabaseHandler(DatabaseConnectionHandler):
    """
    DatabaseHandler extends DatabaseConnectionHandler to provide additional database functionalities.
    It initializes the database connection and sets up the session for further operations.
    """
    
    def __init__(self):
        """
        Initializes the DatabaseHandler by calling the parent constructor.
        """
        super().__init__()
        logger.info("DatabaseHandler initialized successfully.")

    def populate_tables_from_schema(self):
        """
        Populates tables with initial data from self.schema['table_data'].
        For each table, deletes existing data and inserts new rows.
        """
        table_data_list = self.schema.get(self.database_name, {}).get('table_data', [])
        for table_data in table_data_list:
            logger.info(f"Populating table: {table_data['name']}")
            table_name = table_data['name']
            data_rows = table_data.get('data', [])
            session = self.get_session()
            try:
                # DELETE existing data
                delete_stmt = f"DELETE FROM {table_name};"
                logger.info(f"Executing SQL: {delete_stmt}")
                session.execute(text(delete_stmt))
                # INSERT new data
                for row in data_rows:
                    columns = ', '.join(row.keys())
                    placeholders = ', '.join([f":{k}" for k in row.keys()])
                    insert_stmt = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders});"
                    logger.info(f"Executing SQL: {insert_stmt} with {row}")
                    session.execute(text(insert_stmt), row)
                session.commit()
            except Exception as e:
                logger.error(f"Error populating table {table_name}: {e}")
                session.rollback()
            finally:
                session.close()

    def create_tables_from_schema(self):
        """
        Reads self.schema and creates tables in the database if they do not exist.
        Handles types, primary keys, auto-increment, not-null, and foreign keys.
        """
        tables = self.schema.get(self.database_name, {}).get('table', [])
        for table in tables:
            logger.info(f"Creating table: {table['name']}")
            table_name = table['name']
            columns = []
            pk = []
            fk = []
            for col in table['columns']:
                col_def = f"{col['name']} "
                col_type = col['type'].lower()
                # Map types
                if col_type == 'string':
                    col_def += "VARCHAR(255)"
                elif col_type == 'integer':
                    col_def += "INTEGER"
                elif col_type == 'float':
                    col_def += "REAL"
                else:
                    col_def += col_type.upper()
                # Not null
                if not col.get('nullable', True):
                    col_def += " NOT NULL"
                # Primary key
                if col.get('primary_key', False):
                    pk.append(col['name'])
                # Auto increment (only valid for INTEGER PRIMARY KEY in SQLite)
                if col.get('auto_increment', False) and col.get('primary_key', False) and col_type == 'integer':
                    col_def += " PRIMARY KEY AUTOINCREMENT"
                # Foreign key
                if 'foreign_key' in col:
                    fk.append(
                        f"FOREIGN KEY ({col['name']}) REFERENCES {col['foreign_key']['table']}({col['foreign_key']['column']})"
                    )
                columns.append(col_def)
            # Add primary key constraint (only if not already set by AUTOINCREMENT)
            if pk and not any(
                col.get('auto_increment', False) and col.get('primary_key', False) and col['type'].lower() == 'integer'
                for col in table['columns']
            ):
                columns.append(f"PRIMARY KEY ({', '.join(pk)})")
            # Add foreign key constraints
            columns.extend(fk)
            create_stmt = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(columns)});"
            logger.info(f"Executing SQL: {create_stmt}")
            session = self.get_session()
            try:
                session.execute(text(create_stmt))
                session.commit()
            except Exception as e:
                logger.error(f"Error executing SQL: {e}")
                session.rollback()
            finally:
                session.close()

    def get_primary_kpi_name_by_id(self, kpi_id: int) -> str:
        """
        Retrieves the primary KPI name by its ID.

        Parameters:
        -----------
        kpi_id : int
            The ID of the primary KPI.

        Returns:
        --------
        str
            The name of the primary KPI, or an empty string if not found.
        """
        session = self.get_session()
        try:
            logger.info(f"Fetching primary KPI name for ID: {kpi_id}")
            kpi = session.query(PrimaryKPI).filter(PrimaryKPI.id == kpi_id).first()
            return kpi.name if kpi else ""
        except Exception as e:
            logger.error(f"Error fetching primary KPI by ID {kpi_id}: {e}")
            return ""
        finally:
            session.close()

    def get_all_projects(self):
        """
        Retrieves all projects from the database and returns them as a list of dicts.
        Each dict contains the project's attributes.
        """
        session = self.get_session()
        try:
            logger.info("Fetching all projects from the database.")
            projects = session.query(Project).all()
            result = [
                {
                    "id": str(project.id),
                    "project_name": project.project_name,
                    "project_description": project.project_description,
                    "plant_capacity": project.plant_capacity,
                    "discount_rate": project.discount_rate,
                    "project_duration": project.project_duration,
                    "primary_kpi_id": project.primary_kpi_id
                }
                for project in projects
            ]
            return result
        except Exception as e:
            logger.error(f"Error fetching projects: {e}")
            return []
        finally:
            session.close()

    def get_all_primary_kpis(self):
        """
        Retrieves all primary KPIs from the database and returns them as a list of dicts.
        Each dict contains 'id' and 'name' keys as strings.
        """
        session = self.get_session()
        try:
            logger.info("Fetching all primary KPIs from the database.")
            kpis = session.query(PrimaryKPI).all()
            result = [
                {
                    "id": str(kpi.id),
                    "name": kpi.name
                }
                for kpi in kpis
            ]
            return result
        except Exception as e:
            logger.error(f"Error fetching primary KPIs: {e}")
            return []
        finally:
            session.close()

    def add_project(self, project: Project) -> None:
        """
        Adds a new project to the database and returns its ID.

        Parameters:
        -----------
        project : Project
            The project instance to be added.
        """
        session = self.get_session()
        try:
            logger.info(f"Adding project: {project.project_name}")
            session.add(project)
            session.commit()
            logger.info(f"Project {project.project_name} added successfully.")
        except Exception as e:
            logger.error(f"Error adding project: {e}")
            session.rollback()
            raise
        finally:
            session.close()

    def update_project_by_id(self, project_id: int, project_data: dict):
        """
        Updates an existing project in the database by its ID.

        Parameters:
        -----------
        project_id : int
            The ID of the project to update.
        project_data : dict
            A dictionary containing the updated project data.
        """
        session = self.get_session()
        try:
            logger.info(f"Updating project with ID: {project_id}")
            project = session.query(Project).filter(Project.id == project_id).first()
            if not project:
                logger.warning(f"Project with ID {project_id} not found.")
                return None
            for key, value in project_data.__dict__.items():
                if not key.startswith('_'):
                    setattr(project, key, value)
            session.commit()
            logger.info(f"Project with ID {project_id} updated successfully.")
            return project
        except Exception as e:
            logger.error(f"Error updating project with ID {project_id}: {e}")
            session.rollback()
            return None
        finally:
            session.close()

    def get_project_by_id(self, project_id: int):
        """
        Retrieves a project from the database by its ID.

        Parameters:
        -----------
        project_id : int
            The ID of the project to retrieve.

        Returns:
        --------
        dict or None
            A dictionary containing the project's attributes if found, otherwise None.
        """
        session = self.get_session()
        try:
            logger.info(f"Fetching project with ID: {project_id}")
            project = session.query(Project).filter(Project.id == project_id).first()
            if project:
                return {
                    "id": str(project.id),
                    "project_name": project.project_name,
                    "project_description": project.project_description,
                    "plant_capacity": project.plant_capacity,
                    "discount_rate": project.discount_rate,
                    "project_duration": project.project_duration,
                    "primary_kpi_id": project.primary_kpi_id,
                    "total_equipment_cost": project.total_equipment_cost,
                    "total_utility_cost": project.total_utility_cost,
                    "product_selling_price": project.product_selling_price
                }
            else:
                logger.warning(f"Project with ID {project_id} not found.")
                return None
        except Exception as e:
            logger.error(f"Error fetching project with ID {project_id}: {e}")
            return None
        finally:
            session.close()

    def delete_project_by_id(self, project_id: int) -> bool:
        """
        Deletes a project from the database by its ID.

        Parameters:
        -----------
        project_id : int
            The ID of the project to delete.

        Returns:
        --------
        bool
            True if the project was deleted, False otherwise.
        """
        session = self.get_session()
        try:
            logger.info(f"Deleting project with ID: {project_id}")
            project = session.query(Project).filter(Project.id == project_id).first()
            if project:
                session.delete(project)
                session.commit()
                logger.info(f"Project with ID {project_id} deleted successfully.")
                return True
            else:
                logger.warning(f"Project with ID {project_id} not found.")
                return False
        except Exception as e:
            logger.error(f"Error deleting project with ID {project_id}: {e}")
            session.rollback()
            return False
        finally:
            session.close()