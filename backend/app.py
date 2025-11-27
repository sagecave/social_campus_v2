from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from flask_cors import CORS
from flask_session import Session
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import x 
import send_emails
import time
import uuid
import os
import io
import csv
import json

# This request is for e.g to make a call to a docs sheet
# import requests 



from icecream import ic
ic.configureOutput(prefix=f'----- | ', includeContext=True)


app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://127.0.0.1:3000"],allow_headers=["Content-Type"], expose_headers=["Content-Type"])

app.config["SECRET_KEY"] = "your_fixed_secret_key"
app.config['SESSION_TYPE'] = 'filesystem'
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  



Session(app)

@app.context_processor
def global_variables():
    return dict (
        # dictionary = dictionary,
        x = x
    )

# TODO: change the url name to make more sense this is the home page
@app.get("/user-data")
@x.no_cache
def get_data(): 
    user = session.get("user", "")
    ic("Session after login:", session)
    if not user: 
        return jsonify({"redirect": "/login"})
   

    try:
        q = "SELECT user_first_name FROM `users` WHERE user_pk = %s"
        db,cursor = x.db()
        cursor.execute(q,(user["user_pk"],))
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
@x.no_cache
def login_submit():
    ic("request from login form")
    if request.method == "GET":

        if session.get("user",""): 
            redirect_url = "/"
            ic("XXXXXX - User in session", session["user"])
            return jsonify({"redirect": "/"})
        return jsonify({"redirect": "/login"})
        
        
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
            if not check_password_hash(user["user_password"], user_password):
                raise Exception(("Invalid password"), 400)
            user.pop("user_password")
            session["user"] = user  
        
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
   
    if request.method == "POST":
        try:
            data = request.get_json()
            user_first_name = data.get("firstName")
            user_last_name = data.get("lastName")
            user_username = data.get("username")
            user_education = data.get("education")
            user_school = data.get("shcool") 
            user_email = data.get("email")
            user_password = data.get("password")
            user_verification_key = uuid.uuid4().hex
            user_verified_at = 0 
            user_first_name = x.validate_user_first_name(user_first_name)   
            user_username = x.validate_user_username(user_username)
            user_email = x.validate_user_email(user_email)
            user_last_name = x.validate_user_last_name(user_last_name)
            user_password = x.validate_user_password(user_password)
            user_password = generate_password_hash(user_password)
             
            

            q = "INSERT INTO users (`user_first_name`, `user_last_name`, `user_username`, `user_education`, `user_school`, `user_email`, `user_password`, `user_verification_key`, `user_verified_at`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"

            db,cursor = x.db()
            cursor.execute(q,(user_first_name, user_last_name, user_username, user_education, user_school, user_email, user_password, user_verification_key, user_verified_at))
            db.commit()

            email_verify_account = render_template("_email_verify_account.html", user_verification_key=user_verification_key)
            ic(email_verify_account)
            send_emails.send_verify_email(user_email, user_verification_key)

            redirect_url = "/"
            return jsonify(redirect_url)
        except Exception as e: 
            ic(e)
            pass
        finally:
            if "cursor" in locals(): cursor.close()
            if "db" in locals(): db.close()


####################LOGIN OUT############################
@app.post("/logout-submit")
def logout(): 
    try:
        session.clear()
        return jsonify("/login")
    except Exception as e:
        ic(e)
        return "error with logout"
    finally:
        pass

####################SESSION CHECK############################
@app.get("/session-check")
def session_check():
    user = session.get("user","")
    ic("Session check user:", user)
    if user:
       
        return jsonify({"redirect": "/"})
    return jsonify({"redirect": None})


####################VERIFY ACCOUNT############################
@app.route("/verify-account", methods=["GET"])
def verify_account():
    try:
        user_verification_key = x.validate_uuid4_without_dashes(request.args.get("key", ""))
        ic(user_verification_key,"TROR DET ER LORT")
        user_verifief_at = int(time.time())
        db, cursor = x.db()
        q = "UPDATE users SET user_verification_key = '', user_verified_at = %s WHERE user_verification_key = %s"
        cursor.execute(q,(user_verifief_at, user_verification_key))
        db.commit()
        if cursor.rowcount != 1: raise Exception("Invalid key", 400)
        return redirect("http://127.0.0.1:3000/")
    except Exception as ex:
        ic(ex)
        
        if "db" in locals(): db.rollback()
        # User errors
        # if ex.args[1] == 400: return ex.args[0], 400   
        if ex.args[1] == 400: 
            return redirect("http://127.0.0.1:3000/login") 
        # System or developer error
        # return "Cannot verify user" 
        return redirect("http://127.0.0.1:3000/login")
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
        