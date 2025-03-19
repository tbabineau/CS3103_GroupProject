import pymysql
import pymysql.cursors
import settings

def getUser(username): #DONT FORGET TO ADD DATA SANITIZATION
    dbConnection = pymysql.connect(
            host=settings.DB_HOST,
            user=settings.DB_USER,
            password=settings.DB_PASSWD,
            database=settings.DB_DATABASE,
            charset='utf8mb4',
            cursorclass= pymysql.cursors.DictCursor)
    cursor = dbConnection.cursor()
    sql = "SELECT FROM users WHERE username == %s"
    cursor.execute(sql, (username,))
    result = cursor.fetchall()
    return result