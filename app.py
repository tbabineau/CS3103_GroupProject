#!/usr/bin/env python3

from flask import Flask, jsonify, abort, request, make_response, session, redirect
from flask_restful import Resource, Api, reqparse
from flask_session import Session
from secrets import token_hex
from time import time, gmtime, strptime, mktime
import hashlib
import json
import ssl

import settings # Our server and db settings, stored in settings.py
from db_util import callStatement, callProc# Database connection helper
from emailer import sendEmail

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
    def isValid():
        if 'userId' in session:
            if session['expiry'] <= time():
                session.pop('userId')
                session.pop('expiry')
                session.pop('username')
                return False
            return True
        return False
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
                    session['username'] = user['username']
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
            if('cart' in session):
                session.pop('cart')
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
            tempTime = gmtime()
            datetime = f'{tempTime.tm_year}-{tempTime.tm_mon}-{tempTime.tm_mday} {tempTime.tm_hour}:{tempTime.tm_min}:{tempTime.tm_sec}'
            sql = "INSERT INTO users (username, email, fname, lname, password_hash, salt, last_login) VALUES (%s, %s, %s, %s, %s, %s, %s);"
            params = (request_params['username'], request_params['email'], request_params['firstname'], request_params['lastname'], str(hashed_pwd), str(salt), datetime)
            result = callStatement(sql, params)
            session['userId'] = callStatement("SELECT userId FROM users WHERE username = %s;", (request_params['username']))[0]['userId']
            session['username'] = request_params['username']
            session['expiry'] = time() + 3600
            return make_response(jsonify( {"status": "Successfully registered"}), 201)
        else:
            return make_response(jsonify( {"status": "Username or email already in use"} ), 409)

#Email verification endpoint
class verify(Resource):
    def get(self):
        if login.isValid():
            results = callStatement("SELECT * FROM verifiedUsers WHERE userId = %s;", (session['userId']))
            if(len(results) == 0): #ensureing the user isn't already verified
                results = callStatement("SELECT * FROM verification WHERE userId = %s;", (session['userId']))
                if(len(results) != 0): #Checking if there is already a verification hash for the user, deleting it if there is
                    callStatement("DELETE FROM verification WHERE userId = %s", (session['userId']))
                email = callStatement("SELECT email FROM users WHERE userId = %s;", (session['userId']))[0]['email'] #Getting the users email
                hash = hashlib.sha512()
                tempTime = gmtime()
                hash.update((session['username']).encode("utf-8"))
                hash.update(email.encode("utf-8"))
                hash.update(str(tempTime[5]).encode("utf-8"))
                hash.update(str(tempTime[4]).encode("utf-8"))
                hash.update(str(tempTime[3]).encode("utf-8"))
                verifyHash = str(hash.hexdigest()) #Generating verification hash
                tempTime = gmtime() #Creating gmtime timestamp, giving the user an hour to verify
                datetime = f'{tempTime.tm_year}-{tempTime.tm_mon}-{tempTime.tm_mday} {tempTime.tm_hour + 1}:{tempTime.tm_min}:{tempTime.tm_sec}'
                sendEmail(email, verifyHash, settings.APP_HOST+":"+str(settings.APP_PORT))
                sql = "INSERT INTO verification (userId, verificationHash, timeStamp) VALUES (%s, %s, %s);"
                params = (session['userId'], verifyHash, datetime)
                result = callStatement(sql, params)
                return make_response(jsonify( {"status": "Verification email sent"} ), 200)
            return make_response(jsonify( {"status": "User already verified"} ), 409)
        return make_response(jsonify( {"status": "User not logged in"} ), 401)
        
class verifier(Resource):
    def get(self, hash):
        return app.send_static_file("verified.html")

    def post(self, hash):
        result = callStatement('SELECT * FROM verification WHERE verificationHash = %s;', (hash))
        if(len(result) != 0):
            result = result[0]
            #This takes the datetime from the DB and converts it into seconds since the epoch to check if the verification has expired
            if(mktime(strptime(str(result['timeStamp']), "%Y-%m-%d %H:%M:%S")) <= time()):
                callStatement("DELETE FROM verification WHERE userId = %s;", (result['userId']))
                return make_response(jsonify( {"status": "Time expired"} ), 410)
            session['userId'] = result['userId']
            callStatement("INSERT INTO verifiedUsers (userId) VALUES (%s);", (session['userId']))
            callStatement("DELETE FROM verification WHERE userId = %s;", (session['userId']))
            return make_response(jsonify ( {"status": "user verified"} ), 200)
        return make_response(jsonify( {"status": "Could not locate hash"} ), 404)
            

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
        if(type(itemId) != int):
            abort(400)
        retItem = callStatement("SELECT * FROM storeItems WHERE itemId = %s", (itemId))
        if(len(retItem) == 1):
            return make_response(jsonify( {"Item": retItem} ), 200)
        else:
            return make_response(jsonify( {"status": "Could not find item"} ), 404)

    def put(self, itemId):
        if not request.json or type(itemId) != int:
            abort(400)
        retItem = callStatement("SELECT * FROM storeItems WHERE itemId = %s", (itemId))
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

        sql = "UPDATE storeItems SET itemName = %s, itemDescription = %s, itemPrice = %s, itemStock = %s, itemPhoto = %s WHERE itemId = %s;"
        params = (request_params['itemName'], request_params['itemDescript'], request_params['price'], request_params['itemStock'], request_params['itemPhoto'], itemId)
        response = callStatement(sql, params)
        print(response)
        if(len(response) == 0):
            make_response(jsonify( {"status": "Item updated", "Item": response} ), 200)
        else:
            abort(500)

    def delete(self, itemId):
        if type(itemId) != int:
            abort(400)
        if(True): #Again, checking for manager status
            retItem = callStatement("SELECT * FROM storeItems WHERE itemId = %s", (itemId))
            if(len(retItem) != 1):
                return make_response(jsonify( {"status": "Could not find item"} ), 404)
            
            response = callStatement("DELETE FROM storeItems WHERE itemId = %s", (itemId))
            return make_response(jsonify( {} ), 204)
        else:
            return make_response(jsonify( {"status": "Unauthorized user"} ), 401)
        
class Reviews(Resource):
    def get(self):
        qs=request.query_string.decode()
        qs=qs.split("&")
        sql="select * from reviews where "
        for q in qs:
            if 'itemId=' in q:
                sql+=f"itemId = {int(q.split('=')[1])} and "
            if 'userId=' in q:
                sql+=f"userId = {int(q.split('=')[1])} and "
            if 'rating=' in q:
                sql+=f"reviewRating = {float(q.split('=')[1])} and "
            if 'maxRating' in q:
                sql+=f"reviewRating <= {float(q.split('=')[1])} and "
            if 'minRating' in q:
                sql+=f"reviewRating >= {float(q.split('=')[1])} and "
        
        sql+="1=1;"
        itemList = callStatement(sql, [])
        return make_response(jsonify({"Reviews": itemList}), 200)
    
    def post(self):
        if not request.json:
            abort(400)
        
        parser=reqparse.RequestParser()
        try:
            #user already in session
            parser.add_argument('itemId', type=int, required=True)
            parser.add_argument('review', type=str, required=True)
            parser.add_argument('rating', type=float, required=True)
            request_params=parser.parse_args()
        except:
            abort(400)

        sql="insert into reviews (itemId, userId, reviewText, reviewRating) values (%s, %s, %s, %s)"
        params=(request_params['itemId'], session['userId'], request_params['review'], round(request_params['rating'], 1))
        result=callStatement(sql, params)
        return make_response(jsonify({"status": "Review created"}), 201)
    
class Review(Resource):
    def get(self, reviewId):
        if(type(reviewId)!=int):
            abort(400)
        getReview = callStatement("select * from reviews where reviewId = %s", (reviewId))
        if(len(getReview)!=1):
            return make_response(jsonify({"status": "Review not found"}), 404)
        else:
            return make_response(jsonify({"Review": getReview}), 200)
    
    def put(self, reviewId):
        if not request.json or type(reviewId)!=int:
            abort(400)
        getReview = callStatement("select * from reviews where reviewId = %s", (reviewId))
        if(len(getReview)!=1):
            return make_response(jsonify({"status": "Review not found"}), 404)
        
        parser = reqparse.RequestParser()
        try:
            parser.add_argument('review', type=str, required=True)
            parser.add_argument('rating', type=float, required=True)
            request_params=parser.parse_args()
        except:
            abort(400)
        #requires sanitization no parameters
        sql="update reviews set reviewText = %s, reviewRating = %s where reviewId = %s;"
        params=(request_params['review'], request_params['rating'], reviewId)
        result=callStatement(sql, params)
        if(len(result)==0):
            make_response(jsonify({"status": "Review updated", "Review": result}), 200)
        else:
            abort(500)

    def delete(self, reviewId):
        if type(reviewId)!=int:
            abort(400)
        #logged user of post can delete their post
        getReview = callStatement("select * from reviews where reviewId = %s", (reviewId))
        if(len(getReview)!=1):
            return make_response(jsonify({"status": "Review does not exist :)"}), 404)
        delReview = callStatement("delete from reviews where reviewId = %s", (reviewId))
        return make_response(jsonify({}), 204)
        #response for different user?
    
#Cart endpoint, used to communicate with the server on what is in the users cart
class cart(Resource):
    def updateCart():#Ensures the session and DB cart are in sync if the user is logged in
        if login.isValid():
            cartItems = callStatement("SELECT * FROM cart WHERE userId = %s", (session['userId']))
            for item in session['cart']: #For adding to DB from session
                if item['userId'] == None:
                    item['userId'] = session['userId']
                collision = False
                for cartItem in cartItems: #For each cart item stored in the database
                    if(cartItem not in session['cart'] and item["itemId"] == cartItem["itemId"]):
                        collision = True
                        #If the items aren't the same, then the quantity is the only thing wrong. Take DB cart to be correct
                        item["quantity"] = cartItem["quantity"] 
                        break
                if(not collision and item not in cartItems):
                    sql = "INSERT INTO cart (userId, ItemId, quantity) VALUES (%s, %s, %s);"
                    params = (session['userId'], item['itemId'], item['quantity'])
                    cartItem = callStatement(sql, params)
            for item in cartItems: #For each cart item stored in the database
                collision = False
                for sessionItem in session['cart']:
                    if(sessionItem not in cartItems and sessionItem["itemId"] == item["itemId"]):
                        print("^FLAG^")
                        collision = True
                        sessionItem["quantity"] = item["quantity"] 
                        break
                if(not collision and item not in session['cart']):
                    session['cart'].append(item)
    def get(self):
        if 'cart' not in session or session['expiry'] <= time():
            session['cart'] = []
        cart.updateCart()
        #Allows users to search in cart
        def selector(item):
            qs = request.query_string.decode()
            qs = qs.split("&")
            for q in qs:
                if 'quantity=' in q:
                    if(item['quantity'] != int(q.split("=")[1])):
                        return False
                if 'maxQuantity=' in q:
                    if(item['quantity'] > int(q.split("=")[1])):
                        return False
                if 'minQuantity=' in q:
                    if(item['quantity'] < int(q.split("=")[1])):
                        return False
            return True
        toDisplay = list(filter(selector, session['cart']))
                
        return(make_response(jsonify( {"cart": toDisplay} ), 200))
    
    def post(self): #Adding an item to the cart
        if not request.json:
            abort(400)
        parser = reqparse.RequestParser()
        try:
            parser.add_argument('itemId', type=int, required=True)
            parser.add_argument('quantity', type=int, required=True)
            request_params = parser.parse_args()
        except:
            abort(400) #Bad request
        #Adding the cart to the session allows us to save a cart if the user starts shopping before they are logged in
        if 'cart' not in session:
            session['cart'] = []
        cart.updateCart()
        
        for item in session['cart']:
            if item["itemId"] == request_params["itemId"]:
                return make_response(jsonify( {"status": "Item already in cart"} ), 409)
        
        response = callStatement("SELECT * FROM storeItems WHERE itemId = %s", (request_params['itemId']))
        if(len(response) != 0):
            if('userId' in session): #If signed in, add to DB cart
                sql = "INSERT INTO cart (userId, ItemId, quantity) VALUES (%s, %s, %s);"
                params = (session['userId'], request_params['itemId'], request_params['quantity'])
                cartItem = callStatement(sql, params)
                print(cartItem)
            #Add to session cart as long as the item exists
            session['cart'].append({"userId": None, "itemId": request_params['itemId'], "quantity": request_params['quantity']})
            return make_response(jsonify( {"status": "Item added to cart"} ), 201)
        return make_response(jsonify( {"status": "Item could not be found"} ), 404)
    
    def delete(self): #Used for "checkout" or just general cart clearing
        if('cart' not in session and 'userId' not in session):
            return make_response(jsonify( {"status": "No cart to clear"} ), 404)
        if 'cart' in session:
            session.pop('cart')

        if login.isValid():
            callStatement("DELETE FROM cart WHERE userId = %s", (session['userId']))
        return make_response({}, 204)

class cartItem(Resource):
    def put(self, itemId): #Updating cart quantity
        if not request.json:
            abort(400) #Bad request
        parser = reqparse.RequestParser()
        try:
            parser.add_argument('quantity')
            request_params = parser.parse_args()
        except:
            abort(400) #Bad request
        cart.updateCart() #Ensures DB and session cart are synced if logged in

        for item in session['cart']:
            if(item['itemId'] == itemId):
                item['quantity'] = request_params['quantity']
                if login.isValid(): #Since cart is synced, if the item is in the session cart it will be in the DB cart
                    sql = "UPDATE cart SET quantity = %s WHERE itemId = %s AND userId = %s;"
                    params = (request_params['quantity'], itemId, session['userId'])
                    result = callStatement(sql, params)
                    print(result)
                return(make_response(jsonify( {"status": "Cart item updated"} ), 200))
        return(make_response(jsonify( {"status": "Item not in cart"} ), 404))
    
    def delete(self, itemId): #Removing an item from a cart
        cart.updateCart() #Ensures DB and session carts are synced if logged in

        for item in session['cart']:
            if(item['itemId'] == itemId):
                session['cart'].remove(item)
                if login.isValid():
                    sql = "DELETE FROM cart WHERE userId = %s AND itemId = %s;"
                    params = (session['userId'], itemId)
                    result = callStatement(sql, params)
                return make_response(jsonify( {} ), 204)
        return make_response(jsonify( {"status": "Item not in cart to remove"} ), 404)

                
        
api = Api(app)
api.add_resource(root, '/')
api.add_resource(login, '/login')
api.add_resource(register, "/register")
api.add_resource(verify, '/verify')
api.add_resource(verifier, '/verify/<string:hash>')
api.add_resource(dev, "/dev")
api.add_resource(store, "/store")
api.add_resource(items, "/items")
api.add_resource(item, "/items/<int:itemId>")
api.add_resource(Reviews, '/reviews')
api.add_resource(Review, '/reviews/<int:reviewId>')
api.add_resource(cart, "/cart")
api.add_resource(cartItem, "/cart/<int:itemId>")

#############################################################################
# xxxxx= last 5 digits of your studentid. If xxxxx > 65535, subtract 30000
if __name__ == "__main__":
#    app.run(host="cs3103.cs.unb.ca", port=xxxx, debug=True)
    context = ('cert.pem', 'key.pem')
    app.run(host=settings.APP_HOST, port=settings.APP_PORT, ssl_context = context, debug=settings.APP_DEBUG)