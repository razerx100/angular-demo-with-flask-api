from app import api, db
from flask import jsonify, request, make_response
from functools import wraps
from app.models import Hero
from sqlalchemy import create_engine
from config import Config

engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

def check_auth(username, password):
    return username == "razerx100" and password == "3540"

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return make_response({'Error': 'Basic Auth Required.'}, 401)
        return f(*args, **kwargs)
    return decorated

@api.route('/api/heroes', methods=['GET', 'POST'])
@requires_auth
def heroes_list():
    if request.method == 'POST':
        hero = Hero(name=request.json['name'])
        db.session.add(hero)
        db.session.commit()
        return {'Add': 'Successful'}
    else:
        if request.args:
            fetched_data = engine.connect().execute(f"SELECT * FROM hero WHERE name GLOB '*{request.args['name']}*'").fetchall()
            heroes = []
            for data in fetched_data:
                heroes.append({"id": data[0], "name": data[1]})
            return jsonify(heroes)
        else:
            data = Hero.query.all()
            heroes = []
            for i in data:
                heroes.append({"id": i.id, "name": i.name})
            return jsonify(heroes)

@api.route('/api/heroes/<id>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@requires_auth
def hero_by_id(id):
    if request.method == 'PUT':
        hero = Hero.query.get(id)
        hero.name = request.json['name']
        db.session.add(hero)
        db.session.commit()
        return {'Update': 'Successful!'}
    elif request.method == 'DELETE':
        hero = Hero.query.get(id)
        db.session.delete(hero)
        db.session.commit()
        return {'Delete': 'Successful'}
    else:
        hero = Hero.query.get(id)
        if hero:
            return {'id': hero.id, 'name': hero.name}
        else:
            return make_response({'Error': 'Hero not found!'}, 404)
