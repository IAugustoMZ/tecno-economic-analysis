import logging
from sqlalchemy import text
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

    def get_all_primary_kpis(self):
        """
        Retrieves all primary KPIs from the database and returns them as a list of dicts.
        Each dict contains 'id' and 'name' keys as strings.
        """
        session = self.get_session()
        try:
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