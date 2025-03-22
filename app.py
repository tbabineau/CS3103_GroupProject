#!/usr/bin/env python3

from flask import Flask, jsonify, abort, request, make_response, session, redirect
from flask_restful import Resource, Api, reqparse
from flask_session import Session
from secrets import token_hex
from time import time, gmtime
import hashlib
import json
import ssl

import settings # Our server and db settings, stored in settings.py
from db_util import callStatement, callProc# Database connection helper

app = Flask(__name__, static_url_path='/static')
app.secret_key = settings.SECRET_KEY
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_NAME'] = 'CS3103-shop'
app.config['SESSION_COOKIE_DOMAIN'] = settings.APP_HOST
Session(app)


####################################################################################
#
# Error handlers
#
@app.errorhandler(400) # decorators to add to 400 response
def not_found(error):
    return make_response(jsonify( { "status": "Bad request" } ), 400)

@app.errorhandler(404) # decorators to add to 404 response
def not_found(error):
    return make_response(jsonify( { "status": "Resource not found" } ), 404) #Can edit this to make the app return a 404 page

@app.errorhandler(500) # decorators to add to 500 response
def not_found(error):
	return make_response(jsonify( { 'status': 'Internal server error' } ), 500)

####################################################################################
#
# Static Endpoints for humans
#
#root endpoint
class root(Resource):
    def get(self):
        if('userId' in session and session['expiry'] > time()):
            return app.send_static_file("storefront.html")
        else:
            return app.send_static_file("log_in_page.html")
#API endpoint
class dev(Resource):
    def get(self):
        return app.send_static_file("API.html")

#store page endpoint
class store(Resource):
    def get(self):
        return app.send_static_file("storefront.html")
    
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
        #Checking if the user is already logged in
        if('userId' in session and session['expiry'] > time()):
            session['expiry'] = time() + 3600 #Updating session expiry if user is already logged in
            return make_response(jsonify( {"status": "Logged in"} ), 200)
        
        sql = "SELECT * FROM users WHERE username = %s;"
        matching = callStatement(sql, (request_params['username']))
        pwd = request_params['password']
        if(len(matching) != 0): #Checking if there were any rows returned
            for user in matching: #Incase there are duplicate usernames, but there shouldn't be
                #Hashing the inputted password with the salt from the database
                hash = hashlib.sha512()
                hash.update((pwd + user['salt']).encode("utf-8"))
                hashed_pwd = hash.hexdigest()
                if(str(hashed_pwd) == user['password_hash']):
                    session['userId'] = user['userId']
                    session['expiry'] = time() + 3600 #Setting the session to time out in one hour
                    #Clear login attempts, update last login date using GMT
                    callStatement("UPDATE users SET login_attempts = 0 WHERE userId = %s", (user['userId']))
                    tempTime = gmtime()
                    datetime = f'{tempTime.tm_year}-{tempTime.tm_mon}-{tempTime.tm_mday} {tempTime.tm_hour}:{tempTime.tm_min}:{tempTime.tm_sec}'
                    callStatement("UPDATE users SET last_login = %s WHERE userId = %s", (datetime, user['userId']))
                    return make_response(jsonify( {"status": "Logged in"} ), 200)
                else:
                    #Increase login_attempts by 1
                    callStatement("UPDATE users SET login_attempts = login_attempts + 1 WHERE userId = %s", (user['userId']))
                    return make_response(jsonify( {"status": "Incorrect credentials"} ), 400)

                
        return make_response(jsonify( {"status": "Incorrect credentials"} ), 400)
    
    def delete(self):
        if('userId' in session):
            session.pop('userId')
            return make_response({}, 204)
        else:
            return make_response(jsonify( {"status": "Not logged in"} ), 404)
            

#register endpoint
class register(Resource):
    def get(self):
        return app.send_static_file("register_page.html") #Loads the register page on request
    def post(self):
        if not request.json:
            abort(400) #bad request
        parser = reqparse.RequestParser()
        try:
            parser.add_argument('username', type=str, required=True)
            parser.add_argument('email', type=str, required=True)
            parser.add_argument('firstname', type=str, required=True)
            parser.add_argument('lastname', type=str, required=True)
            parser.add_argument('password', type=str, required=True)
            request_params = parser.parse_args()
        except:
            abort(400) #bad request
        
        #Check if username or email is in use
        sql = "SELECT * FROM users WHERE username = %s OR email = %s;"
        result = callStatement(sql, (request_params['username'], request_params['email']))
        if(len(result) == 0):
            #Creating 32 byte salt and hashing password with sha512
            salt = token_hex(32)
            hash = hashlib.sha512()
            hash.update((request_params['password'] + salt).encode("utf-8"))
            hashed_pwd = hash.hexdigest()

            sql = "INSERT INTO users (username, email, fname, lname, password_hash, salt) VALUES (%s, %s, %s, %s, %s, %s);"
            params = (request_params['username'], request_params['email'], request_params['firstname'], request_params['lastname'], str(hashed_pwd), str(salt))
            result = callStatement(sql, params)
            return make_response(jsonify( {"status": "Successfully registered"}), 201)
        else:
            return make_response(jsonify( {"status": "Username or email already in use"} ), 409)
        
#Items endpoint, no page associated with it
class items(Resource):
    def get(self):
        qs = request.query_string.decode()
        qs = qs.split("&")
        sql = "SELECT * FROM storeItems WHERE "
        for q in qs:
            if 'search=' in q:
                sql += "(itemName LIKE '%%"+q.split('=')[1]+"%%'  OR itemDescription LIKE '%%"+q.split('=')[1]+"%%') AND "
            if 'quantity=' in q:
                sql += f"itemStock = {int(q.split('=')[1])} AND "
            if 'maxQuantity=' in q:
                sql += f"itemStock <= {int(q.split('=')[1])} AND "
            if 'minQuantity=' in q:
                sql += f"itemStock >= {int(q.split('=')[1])} AND "
            if 'price=' in q:
                sql += f"itemPrice = {float(q.split('=')[1])} AND "
            if 'maxPrice=' in q:
                sql += f"itemPrice <= {float(q.split('=')[1])} AND "
            if 'minPrice=' in q:
                sql += f"itemPrice >= {float(q.split('=')[1])} AND "
                
        sql += "1 = 1;"
        itemList = callStatement(sql, ())
        return make_response(jsonify( {"Items": itemList} ), 200)
    
    def post(self):
        if not request.json:
            abort(400) #bad request
        parser = reqparse.RequestParser()
        try:
            parser.add_argument('itemName', type=str, required=True)
            parser.add_argument('itemDescript', type=str, required=True)
            parser.add_argument('itemPhoto', type=str, required=True)
            parser.add_argument('price', type=float, required=True)
            parser.add_argument('itemStock', type=int, required=True)
            request_params = parser.parse_args()
        except:
            abort(400) #bad request
        
        if(True): #Should check for management flag here, currently not implemented
            print(type(request_params['price']))
            sql = "INSERT INTO storeItems (itemName, itemDescription, itemPrice, itemStock, itemPhoto) VALUES (%s, %s, %s, %s, %s)"
            params = (request_params['itemName'], request_params['itemDescript'], round(request_params['price'], 2), request_params['itemStock'], request_params['itemPhoto'])
            result = callStatement(sql, params)
            print(result)
            return make_response(jsonify( {"status": "Item created"} ), 201)
        else:
            return make_response(jsonify( {"status": "User does not have permission"} ), 401)

#Specific item endpoint, no static page for it
class item(Resource):
    def get(self, itemId):
        if(type(itemId) != type(int)):
            abort(400)
        retItem = callStatement("SELECT * FROM storeItems WHERE itemId = %i", (itemId))
        if(len(retItem) == 1):
            return make_response(jsonify( {"Item": retItem} ), 200)
        else:
            return make_response(jsonify( {"status": "Could not find item"} ), 404)

    def put(self, itemId):
        if not request.json or type(itemId) != type(int):
            abort(400)
        retItem = callStatement("SELECT * FROM storeItems WHERE itemId = %i", (itemId))
        if(len(retItem) != 1):
            return make_response(jsonify( {"status": "Could not find item"} ), 404)
        
        parser = reqparse.RequestParser()
        try:
            parser.add_argument('itemName', type=str, required=True)
            parser.add_argument('itemDescript', type=str, required=True)
            parser.add_argument('itemPhoto', type=str, required=True)
            parser.add_argument('price', type=float, required=True)
            parser.add_argument('itemStock', type=int, required=True)
            request_params = parser.parse_args()
        except:
            abort(400) #bad request

        sql = "UPDATE storeItems SET itemName = %s, itemDescription = %s, itemPrice = %s, itemStock = %s, itemPhoto = %s WHERE itemId = %i;"
        params = (request_params['itemName'], request_params['itemDescript'], request_params['price'], request_params['itemStock'], request_params['itemPhoto'], itemId)
        response = callStatement(sql, params)
        if(len(response) != 0):
            make_response(jsonify( {"status": "Item updated", "Item": response} ), 200)
        else:
            abort(500)

    def delete(self, itemId):
        if not request.json or type(itemId) != type(int):
            abort(400)
        if(True): #Again, checking for manager status
            retItem = callStatement("SELECT * FROM storeItems WHERE itemId = %i", (itemId))
            if(len(retItem) != 1):
                return make_response(jsonify( {"status": "Could not find item"} ), 404)
            
            response = callStatement("DELETE FROM storeItems WHERE itemId = %i", (itemId))
            return make_response(jsonify( {} ), 204)
        else:
            return make_response(jsonify( {"status": "Unauthorized user"} ), 401)




api = Api(app)
api.add_resource(root, '/')
api.add_resource(login, '/login')
api.add_resource(register, "/register")
api.add_resource(dev, "/dev")
api.add_resource(store, "/store")
api.add_resource(items, "/items")
api.add_resource(item, "/items/<int:itemId>")

#############################################################################
# xxxxx= last 5 digits of your studentid. If xxxxx > 65535, subtract 30000
if __name__ == "__main__":
#    app.run(host="cs3103.cs.unb.ca", port=xxxx, debug=True)
    context = ('cert.pem', 'key.pem')
    app.run(host=settings.APP_HOST, port=settings.APP_PORT, ssl_context = context, debug=settings.APP_DEBUG)
