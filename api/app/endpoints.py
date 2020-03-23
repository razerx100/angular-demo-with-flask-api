from app import api
from flask import jsonify, request, make_response
from functools import wraps
from app.models import Hero

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

@api.route('/api/heroes')
@requires_auth
def heroes_list():
    data = Hero.query.all()
    heroes = []
    for i in data:
        heroes.append({"id": i.id, "name": i.name})
    return jsonify(heroes)

@api.route('/api/heroes/<id>')
@requires_auth
def hero_by_id(id):
    hero = Hero.query.get(id)
    if hero:
        return {'id': hero.id, 'name': hero.name}
    else:
        return make_response({'Error': 'Hero not found!'}, 404)
