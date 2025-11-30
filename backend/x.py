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
    user_email = user_email.strip().lower()
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
    user_username = user_username.strip().lower()
    error = f"username min {USER_USERNAME_MIN} max {USER_USERNAME_MAX} characters"
    if len(user_username) < USER_USERNAME_MIN: raise Exception(("User name to small"), 400)
    if len(user_username) > USER_USERNAME_MAX: raise Exception(("username to big"), 400)
    return user_username


############FIRST NAME VALIDATION##################
USER_FIRST_NAME_MIN = 2
USER_FIRST_NAME_MAX = 20
REGEX_USER_FIRST_NAME = f"^.{{{USER_FIRST_NAME_MIN},{USER_FIRST_NAME_MAX}}}$"
def validate_user_first_name(user_first_name ):
    user_first_name = user_first_name.strip().lower()
    error = f"first name min {USER_FIRST_NAME_MIN} max {USER_FIRST_NAME_MAX} characters"
    if not re.match(REGEX_USER_FIRST_NAME, user_first_name): raise Exception(error, 400)
    return user_first_name
    

############LAST NAME VALIDATION##################
USER_LAST_NAME_MIN = 2
USER_LAST_NAME_MAX = 20
REGEX_USER_LAST_NAME = f"^.{{{USER_LAST_NAME_MIN},{USER_LAST_NAME_MAX}}}$"
def validate_user_last_name(user_last_name):
    user_last_name = user_last_name.strip().lower()
    error = f"last name min {USER_LAST_NAME_MIN} max {USER_LAST_NAME_MAX} characters"
    if not re.match(REGEX_USER_LAST_NAME, user_last_name): raise Exception(error, 400)
    return user_last_name


############PASSWORD VALIDATION##################
USER_PASSWORD_MIN = 6
USER_PASSWORD_MAX = 50
REGEX_USER_PASSWORD = f"^.{{{USER_PASSWORD_MIN},{USER_PASSWORD_MAX}}}$"
def validate_user_password(user_password):
    user_password = user_password.strip()
    if not re.match(REGEX_USER_PASSWORD, user_password): raise Exception("Invalid email or password", 400)
    return user_password


############UUID4 VALIDATION##################
REGEX_UUID4_WITHOUT_DASHES = "^[0-9a-f]{8}[0-9a-f]{4}4[0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$"
def validate_uuid4_without_dashes(uuid4 = ""):
    error = "Invalid uuid4 without dashes"
    if not uuid4: raise Exception(error, 400)
    uuid4 = uuid4.strip()
    if not re.match(REGEX_UUID4_WITHOUT_DASHES, uuid4): raise Exception(error, 400)
    return uuid4