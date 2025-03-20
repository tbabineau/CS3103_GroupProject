import pymysql
import pymysql.cursors
import settings

def getUser(username): #DONT FORGET TO ADD DATA SANITIZATION
    dbConnection = pymysql.connect(
            host=settings.MYSQL_HOST,
            user=settings.MYSQL_USER,
            password=settings.MYSQL_PASSWD,
            database=settings.MYSQL_DB,
            charset='utf8mb4',
            cursorclass= pymysql.cursors.DictCursor)
    cursor = dbConnection.cursor()
    sql = "SELECT FROM users WHERE username == %s"
    cursor.execute(sql, (username,))
    result = cursor.fetchall()
    return result