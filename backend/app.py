from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from flask_cors import CORS
from flask_session import Session
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import x 
import time
import uuid
import os
import io
import csv
import json
import requests


from icecream import ic
ic.configureOutput(prefix=f'----- | ', includeContext=True)


app = Flask(__name__)
CORS(app)


@app.get("/user-data")
def get_data(): 

    try:
        q = "SELECT user_first_name FROM `users` WHERE user_pk = 4"
        db,cursor = x.db()
        cursor.execute(q,)
        user = cursor.fetchone()
        ic("XXXXX", user)
        return jsonify(user)
    except Exception as e:
        ic(e)
        pass
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

################################################
@app.route("/login-submit", methods=["GET","POST"])
def login_submit():
    ic("request from login form")
    if request.method == "GET":
        ic("GET request", request.form)
        redirect_url = "/"
        return jsonify(redirect_url)
    
    if request.method == "POST":
        try:
            data = request.get_json()
            ic("data", data)
            user_email = data.get("email")
            user_password = data.get("password")
            ic(user_password)
            q = "SELECT * FROM `users` WHERE user_email = %s"
            db,cursor = x.db()
           
            cursor.execute(q,(user_email,))
            user = cursor.fetchone()  
  
            if not user: raise Exception(("Inavlid email"), 400)      
        
            redirect_url = "/"
            return jsonify(redirect_url)
        except Exception as e:
            ic(e)
            pass
        finally:
            if "cursor" in locals(): cursor.close()
            if "db" in locals(): db.close()
            
       
################################################

@app.route("/signup-submit", methods=["POST"])
def signup_submit():
    ic("request from signup form")
    if request.method == "POST":
        try:
            data = request.get_json()
            user_first_name = data.get("firstName")
            user_last_name = data.get("lastName")
            user_username = data.get("username")
            user_education = data.get("education")
            user_school = data.get("shcool") 
            user_email = data.get("email")
            # user_password = generate_password_hash(data.get("password"))
            user_password = data.get("password")
            q = "INSERT INTO users (`user_first_name`, `user_last_name`, `user_username`, `user_education`, `user_school`, `user_email`, `user_password`) VALUES (%s, %s, %s, %s, %s, %s, %s)"

            db,cursor = x.db()
            # cursor.execute(q,(user_pk, user_first_name, user_last_name, user_username, user_education, user_school, user_email, user_password))
            cursor.execute(q,(user_first_name, user_last_name, user_username, user_education, user_school, user_email, user_password))
            db.commit()
            redirect_url = "/"
            return jsonify(redirect_url)
        except Exception as e: 
            ic(e)
            pass
        finally:
            if "cursor" in locals(): cursor.close()
            if "db" in locals(): db.close()
