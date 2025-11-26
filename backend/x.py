from flask import request, make_response, render_template
import mysql.connector
from email_validator import validate_email, EmailNotValidError
import re 

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from functools import wraps

from icecream import ic
ic.configureOutput(prefix=f'----- | ', includeContext=True)

UPLOAD_ITEM_FOLDER = './images'

###########DATABASE###################
def db():
    try:
        db = mysql.connector.connect(
            host = "mariadb",
            user = "root",  
            password = "password",
            database = "social_campus_v2"
        )
        cursor = db.cursor(dictionary=True)
        return db, cursor
    except Exception as e:
        print(e, flush=True)
        raise Exception("Scoial campus exception - Database under maintenance", 500)

##########NO CACHE####################
def no_cache(view):
    @wraps(view)
    def no_cache_view(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response
    return no_cache_view

############EMAIL VALIDATE##################
def validate_user_email(user_email):
    user_email = user_email.strip()
    try:
        email_validation = validate_email(user_email, check_deliverability=False)
        return email_validation.email
    except EmailNotValidError as e:
        ic(e,"----- | Invalid email format")
        raise Exception(("invalid_email", str(e)), 400)
    finally:
        pass


############USERNAME VALIDATION##################
USER_USERNAME_MIN = 2
USER_USERNAME_MAX = 20
REGEX_USER_USERNAME = f"^.{{{USER_USERNAME_MIN},{USER_USERNAME_MAX}}}$"
def validate_user_username(user_username):
    user_username = user_username.strip()
    error = f"username min {USER_USERNAME_MIN} max {USER_USERNAME_MAX} characters"
    if len(user_username) < USER_USERNAME_MIN: raise Exception(("User name to small"), 400)
    if len(user_username) > USER_USERNAME_MAX: raise Exception(("username to big"), 400)
    return user_username




    