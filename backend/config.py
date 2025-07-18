import os

class AppSettings:
    ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
    DATABASE_FILE_PATH = os.path.join(ROOT_DIR, 'database')
