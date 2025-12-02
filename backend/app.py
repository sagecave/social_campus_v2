
from colorama import init as colorama_init
colorama_init(strip=True, convert=False)


import sys
from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from flask_cors import CORS
from flask_session import Session
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import x 
import send_emails
import time
import uuid
import secrets
import os
import io
import csv
import json

# This request is for e.g to make a call to a docs sheet
# import requests 

def raw_print(*args, **kwargs):
    sys.__stdout__.write(" ".join(map(str, args)) + "\n")
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
###################USER DATA FOR HOME###################################
# TODO: change the url name to make more sense this is the home page
@app.get("/user-data")
@x.no_cache
def get_data(): 
    user = session.get("user", "")
    if not user: return redirect("http://127.0.0.1:3000/login")
    ic("Session after login:", session)
    # if not user: 
    #     return jsonify({"redirect": "/login"})
   

    try:
        q = "SELECT user_first_name, user_last_name FROM `users` WHERE user_pk = %s"
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

###################USERS###################################
@app.get("/post-owner")
def get_post_owner(): 
    try:
        post_owner = request.args.get("owner")
        q = "SELECT * FROM `users` WHERE user_pk = %s"
        db,cursor = x.db()
        post_owner = int(post_owner)
        ic("OWNER OF THE POST", post_owner)
        cursor.execute(q,(post_owner,))
        owner = cursor.fetchone()
        ic("XXXXX", owner)
        return jsonify(owner)
    except Exception as e:
        ic(e)
        pass
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


#####################LOGIN###########################
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
            user_email = x.validate_user_email(user_email)
            user_password = data.get("password")
            ic(user_password)
            q = "SELECT * FROM `users` WHERE user_email = %s"
            db,cursor = x.db()
           
            cursor.execute(q,(user_email,))
            user = cursor.fetchone()  
  
            if not user: raise Exception(("Inavlid email"), 400)   

            if not check_password_hash(user["user_password"], user_password):
                raise Exception(("Invalid password"), 400)
            
            if user["user_verification_key"] != "":
                raise Exception ("user not verified")
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

####################LOGIN OUT############################
@app.post("/logout-submit")
def logout(): 
    try:
        session.clear()
        return jsonify({"redirect": "/login"})
    except Exception as e:
        ic(e)
        return "error with logout"
    finally:
        pass
            
       
####################SIGNUP SUBMIT############################

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

            send_emails.send_verify_email(user_email, user_verification_key)

        
            return jsonify({"redirect": "/"})
        except Exception as e: 
            ic(e)
            pass
        finally:
            if "cursor" in locals(): cursor.close()
            if "db" in locals(): db.close()




####################FORGOT PASSWORD############################
@app.post("/forgot-password")
def forgot_password():
    try:
        data = request.get_json()
        ic("data", data)
        user_email = data.get("email")
        user_email = x.validate_user_email(user_email)
        user_token = secrets.token_urlsafe(32)
        ic("user_token", user_token)
        user_token_created_at = int(time.time())
        db,cursor = x.db()
        q = "UPDATE `users` SET `user_token`=%s ,`user_token_created_at`=%s WHERE user_email = %s"
        cursor.execute(q,(user_token, user_token_created_at, user_email))
        db.commit()
        send_emails.password_reset_email(user_email, user_token)
        return jsonify({"redirect": "/login"})
    except Exception as e:
        ic("PASSWORD WRONG",e)
        #validate, and return to user email "Email is send´t to active account is possiable" or something like that. 
        pass
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()


####################VERIFY PASSWORD CHANGE############################
@app.post("/update-password")
def update_pasword():
    
    try:
        data = request.get_json()
        user_token = data.get("token")
        user_new_password = data.get("password")
        user_new_password = x.validate_user_password(user_new_password)
        user_new_password = generate_password_hash(user_new_password)
        db,cursor = x.db()
        q="UPDATE `users` SET user_token = NULL, `user_password`=%s WHERE user_token = %s;"
        cursor.execute(q,(user_new_password ,user_token))
        db.commit()
        if cursor.rowcount == 0:
            # Token invalid or already used
            return jsonify({"error": "Invalid or expired token"}), 400
        return jsonify({"redirect": "/login"})
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        #validation
        pass
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()


####################SESSION CHECK############################
@app.get("/session-check")
def session_check():
    user = session.get("user","")
    ic("Session check user:", user)
    if user:
       
        return jsonify({"redirect": "/"})
    return jsonify({"redirect": None})

####################TOKEN CHECK############################
#fix after chatgpt
# @app.get("/token-check")
# def token_check():
#     token = request.args.get("key")
#     if not token:
#         #raise exception
#         return jsonify({"valid": False}), 400
    
#     try:
#         db, cursor = x.db()
#         q = "SELECT user_pk, user_token_created_at FROM users WHERE user_token=%s"
#         cursor.execute(q,(token,))
#         user = cursor.fetchone()

#         if not user:
#             #raise exception
#             return jsonify({"valid": False}), 400
        
#         if int(time.time()) - user["user_token_created_at"] > 1800:
#             #raise exception
#             return jsonify({"valid": False, "expired": True}), 410
#         return jsonify({"valid": True})
#     except Exception as e:
#         return jsonify({"valid": False}), 500
#     finally:
#         if "db" in locals(): db.close()
#         if "cursor" in locals(): cursor.close()



####################VERIFY ACCOUNT############################
@app.route("/verify-account", methods=["GET"])
def verify_account():
    try:
        user_verification_key = x.validate_uuid4_without_dashes(request.args.get("key", ""))
        user_verified_at = int(time.time())
        db, cursor = x.db()
        q = "UPDATE users SET user_verification_key = NULL, user_verified_at = %s WHERE user_verification_key = %s"
        cursor.execute(q,(user_verified_at, user_verification_key))
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
        

####################POSTS############################
@app.get("/posts")
def posts():
    try:
        db,cursor = x.db()
        q="SELECT * FROM `posts` ORDER BY `post_created_at` DESC LIMIT 10;"
        cursor.execute(q)
        posts = cursor.fetchall()
        ic("XXXXX", posts)
        return jsonify(posts)
    except Exception as e:
        ic(e)
        pass
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


####################CREATE POST############################
@app.post("/create-post")
def create_post():
    try:
        db,cursor = x.db()
        data = request.get_json()
        post_text = data.get("postText","")
        user = session.get("user", "")
        user_pk = user.get("user_pk","")
        post_created_at = int(time.time())
        q = "INSERT INTO `posts`(`post_text`, `post_created_at`, `user_fk`) VALUES (%s,%s,%s)"
        cursor.execute(q,(post_text, post_created_at, user_pk ))
        db.commit()
        ic("Session check user:", user_pk)
        ic("POST YES",post_text)
        return jsonify({"postStatus": "It worked"})
    except Exception as e:
        ic(e)
        return jsonify({"postStatus": "It did not work"})
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


####################UPDATE POST############################
@app.patch("/update-post")
def update_post():
    try:
        db,cursor= x.db()
        data = request.get_json()
        post_text = data.get("postText","")
        post_pk = data.get("post_pk","")
        user = session.get("user", "")
        user_pk = user.get("user_pk","")
        post_updated_at = int(time.time())
        q ="UPDATE `posts` SET `post_text`=%s,`post_updated_at`=%s WHERE post_pk =%s"
        ic(user_pk,"USER PK")
        ic(post_text, "Updated Text")
        ic(post_pk, "post pk")
        ic(post_updated_at,"TIME")
        cursor.execute(q,(post_text,post_updated_at,post_pk))
        db.commit()
        return jsonify({"postStatus": "Post is updated"})
    except Exception as e:
        ic(e)
        pass
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

####################DELETE POST############################
@app.delete("/delete-post")
def delete_post():
   
    try:
        db,cursor = x.db()
        post_pk = request.args.get("post_id")

        q="DELETE FROM `posts` WHERE post_pk = %s"
        cursor.execute(q,(post_pk,))
        db.commit()
        return jsonify({"postStatus": "Post is deleted"})
    except Exception as e:
        ic(e)
        return jsonify({"postStatus": "Post did not deleted"})
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
####################LIKE############################
@app.post("/like-post")
def like_post():
    try:
        db,cursor = x.db()
        pass
    except Exception as e:
        ic(e)
        pass
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

####################COMMENTS############################
@app.post("/post-comments")
def comment_post():
    try:
        db,cursor = x.db()
        pass
    except Exception as e:
        ic(e)
        pass
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()