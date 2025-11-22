from flask import request, make_response, render_template
import mysql.connector
import re 

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from functools import wraps

from icecream import ic
ic.configureOutput(prefix=f'----- | ', includeContext=True)

UPLOAD_ITEM_FOLDER = './images'

##############################
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
