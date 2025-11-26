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

# This request is for e.g to make a call to a docs sheet
# import requests 



from icecream import ic
ic.configureOutput(prefix=f'----- | ', includeContext=True)


app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://127.0.0.1:3000"],allow_headers=["Content-Type"], expose_headers=["Content-Type"])

app.config["SECRET_KEY"] = "your_fixed_secret_key"
app.config['SESSION_TYPE'] = 'filesystem'
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  
#   SESSION_COOKIE_SAMESITE="None",
#     SESSION_COOKIE_SECURE=False,



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

            # TODO: email verification check
            # if user["user_verification_key"] != "":
            #     raise Exception(("user_allready_exists"), 400)
            user.pop("user_password")
            session["user"] = user  
        
            redirect_url = "/"
            return jsonify(redirect_url)
        except Exception as e:
            ic(e)
            # TODO: handle errors properly, and make toast to them
             # User errors
            # if ex.args[1] == 400:
            #     toast_error = render_template("___toast_error.html", message=ex.args[0])
            #     return f"""<browser mix-update="#toast">{ toast_error }</browser>""", 400

            # System or developer error
            # toast_error = render_template("___toast_error.html", message="System under maintenance")
            # return f"""<browser mix-bottom="#toast">{ toast_error }</browser>""", 500
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
            user_password = generate_password_hash(data.get("password"))

            q = "INSERT INTO users (`user_first_name`, `user_last_name`, `user_username`, `user_education`, `user_school`, `user_email`, `user_password`) VALUES (%s, %s, %s, %s, %s, %s, %s)"

            db,cursor = x.db()
            cursor.execute(q,(user_first_name, user_last_name, user_username, user_education, user_school, user_email, user_password))
            db.commit()
            redirect_url = "/"
            return jsonify(redirect_url)
        except Exception as e: 
            ic(e)
            # TODO: handle errors properly, and make toast to them
            pass
            # if ex.args[1] == 400:
            #     toast_error = render_template("___toast_error.html", message=ex.args[0])
            #     return f"""<mixhtml mix-update="#toast">{ toast_error }</mixhtml>""", 400
        
            # # Database errors
            # if "Duplicate entry" and user_email in str(ex): 
            #     toast_error = render_template("___toast_error.html", message="Email already registered")
            #     return f"""<mixhtml mix-update="#toast">{ toast_error }</mixhtml>""", 400
            # if "Duplicate entry" and user_username in str(ex): 
            #     toast_error = render_template("___toast_error.html", message="Username already registered")
            #     return f"""<mixhtml mix-update="#toast">{ toast_error }</mixhtml>""", 400
            
            # # System or developer error
            # toast_error = render_template("___toast_error.html", message="System under maintenance")
            # return f"""<mixhtml mix-bottom="#toast">{ toast_error }</mixhtml>""", 500

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