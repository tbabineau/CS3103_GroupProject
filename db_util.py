import pymysql
import pymysql.cursors
import settings
import hashlib
import secrets
from flask import jsonify, make_response

def getUser(username): #DONT FORGET TO ADD DATA SANITIZATION
    try:
        dbConnection = pymysql.connect(
                host=settings.MYSQL_HOST,
                user=settings.MYSQL_USER,
                password=settings.MYSQL_PASSWD,
                database=settings.MYSQL_DB,
                charset='utf8mb4',
                cursorclass= pymysql.cursors.DictCursor)
        cursor = dbConnection.cursor()
        sql = "SELECT * FROM users WHERE username = %s;"
        cursor.execute(sql, username)
        result = cursor.fetchall()
        return result
    except:
        return make_response(jsonify( { "status": "Database Error" } ), 500)
    finally:
        dbConnection.close()

def addUser(uname, email, fname, lname, pwd):
    salt = secrets.token_bytes(32)
    hash = hashlib.sha512()
    hash.update((pwd).encode("utf-8") + salt)
    hashed_pwd = hash.digest()
    print(str(hashed_pwd))
    try:
        dbConnection = pymysql.connect(
                host=settings.MYSQL_HOST,
                user=settings.MYSQL_USER,
                password=settings.MYSQL_PASSWD,
                database=settings.MYSQL_DB,
                charset='utf8mb4',
                cursorclass= pymysql.cursors.DictCursor)
        cursor = dbConnection.cursor()
        sql = "INSERT INTO users (username, email, fname, lname, password_hash, salt) VALUES (%s, %s, %s, %s, %s, %s);"
        cursor.execute(sql, (uname, email, fname, lname, str(hashed_pwd), str(salt)))
        return make_response(jsonify( {"status": "Successfully Registered"}), 201)
    except:
        return make_response(jsonify( { "status": "Database Error" } ), 500)
    finally:
        dbConnection.commit()
        dbConnection.close()