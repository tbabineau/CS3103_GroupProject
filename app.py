#!/usr/bin/env python3

from flask import Flask, jsonify, abort, request, make_response, session
from flask_restful import Resource, Api, reqparse
from flask_session import Session
import json

import settings # Our server and db settings, stored in settings.py
from db_util import getUser, addUser# Database connection helper

app = Flask(__name__, static_url_path='/static')
api = Api(app)


####################################################################################
#
# Error handlers
#
@app.errorhandler(400) # decorators to add to 400 response
def not_found(error):
    return make_response(jsonify( { "status": "Bad request" } ), 400)

@app.errorhandler(404) # decorators to add to 404 response
def not_found(error):
    return make_response(jsonify( { "status": "Resource not found" } ), 404)

####################################################################################
#
# Static Endpoints for humans
#
#Login endpoint
class login(Resource):
    def get(self):
        return app.send_static_file('log_in_page.html')

    def post(self):
        if not request.json:
            abort(400) #bad request
        parser = reqparse.RequestParser()
        try:
            parser.add_argument('username', type=str, required=True)
            parser.add_argument('password', type=str, required=True)
            request_params = parser.parse_args()
        except:
            abort(400) #bad request
        
        #if request_params['username'] in session:
            #response = {'status': 'success}
            #responseCode = 200
        #else:
        return getUser(request_params['username'])

#register endpoint
class register(Resource):
    def get(self):
        return app.send_static_file("register_page.html")
    def post(self):
        if not request.json:
            print("NOT JSON")
            abort(400) #bad request
        parser = reqparse.RequestParser()
        try:
            print(request.json)
            parser.add_argument('username', type=str, required=True)
            parser.add_argument('email', type=str, required=True)
            parser.add_argument('firstname', type=str, required=True)
            parser.add_argument('lastname', type=str, required=True)
            parser.add_argument('password', type=str, required=True)
            request_params = parser.parse_args()
        except:
            print("BAD PARSING")
            abort(400) #bad request

        return addUser(request_params['username'], request_params['email'], request_params['firstname'], request_params['lastname'], request_params['password'])
        

#api.add_resource(login,'/') #What should be the default landing page?
api.add_resource(login, '/login')
api.add_resource(register, "/register")
api = Api(app)


#############################################################################
# xxxxx= last 5 digits of your studentid. If xxxxx > 65535, subtract 30000
if __name__ == "__main__":
#    app.run(host="cs3103.cs.unb.ca", port=xxxx, debug=True)
    app.run(host=settings.APP_HOST, port=settings.APP_PORT, debug=settings.APP_DEBUG)
