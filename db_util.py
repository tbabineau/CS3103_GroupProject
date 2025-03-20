import pymysql
import pymysql.cursors
import settings

def callStatement(sql, params):
    try:
        dbConnection = pymysql.connect(
                host=settings.MYSQL_HOST,
                user=settings.MYSQL_USER,
                password=settings.MYSQL_PASSWD,
                database=settings.MYSQL_DB,
                charset='utf8mb4',
                cursorclass= pymysql.cursors.DictCursor)
        cursor = dbConnection.cursor()
        cursor.execute(sql, params)
        return cursor.fetchall()
    except pymysql.MySQLError as e:
        raise Exception('Database Error: ' + str(e))
    finally:
        dbConnection.commit()
        dbConnection.close()

def callProc(proc, params):
    try:
        dbConnection = pymysql.connect(
                host=settings.MYSQL_HOST,
                user=settings.MYSQL_USER,
                password=settings.MYSQL_PASSWD,
                database=settings.MYSQL_DB,
                charset='utf8mb4',
                cursorclass= pymysql.cursors.DictCursor)
        cursor = dbConnection.cursor()
        cursor.callproc(proc, params)
        return cursor.fetchall()
    except pymysql.MySQLError as e:
        raise Exception('Database Error: ' + str(e))
    finally:
        dbConnection.commit()
        dbConnection.close()