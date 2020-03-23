from flask import Flask
from flask_cors import CORS
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

api = Flask(__name__)
api.config.from_object(Config)
CORS(api, resources={r'/api/*': {"origins": "http://localhost:4200"}})
db = SQLAlchemy(api)
migrate = Migrate(api, db)

from app import endpoints, models