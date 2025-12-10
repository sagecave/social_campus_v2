
from colorama import init as colorama_init
colorama_init(strip=True, convert=False)


import sys
from flask import Flask, request, session, redirect, jsonify, flash, url_for, send_from_directory
from flask_cors import CORS
from flask_session import Session
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import x 
import send_emails
import time
import uuid
import secrets
import requests
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

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")

app = Flask(__name__, static_url_path='/uploads', static_folder='uploads'   )

DICTIONARY_FILE = os.path.join(os.path.dirname(__file__), "dictionary.json")
PageUrl = "http://127.0.0.1:3000"
# PageUrl = "https://social-campus-v2.vercel.app"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
CORS(app, supports_credentials=True, origins=[PageUrl],allow_headers=["Content-Type"], expose_headers=["Content-Type"])

app.config["SECRET_KEY"] = "your_fixed_secret_key"
app.config['SESSION_TYPE'] = 'filesystem'
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


Session(app)

@app.context_processor
def global_variables():
    return dict (
        # dictionary = dictionary,
        x = x
    )
################SET LANGUAGE################
allowed_languages = ["english", "danish", "spanish"]
default_language = "english" 

@app.post("/set-language")
def set_language():
    data = request.get_json("language")
    lan = data.get("language")
    if lan not in allowed_languages:
        return jsonify({"status": "invalid language"}), 400
    session["language"] = lan
    return jsonify({"status": "ok", "language": lan}), 200
def language_setting():
    lan = session.get("language", default_language)
    return session.get("language", default_language)
###################DICTIONARY###################################
@app.get("/dictionary")
def get_dictionary():
    try:
        with open(DICTIONARY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            lan= session.get("language",default_language)
    
        return jsonify(data,lan), 200
    except FileNotFoundError:
        return jsonify({"status": "Dictionary not found"}), 404
    except Exception as e:
        return jsonify({"status": "An error occurred", "error": str(e)}), 500
###################USER DATA FOR HOME###################################
# TODO: change the url name to make more sense this is the home page
@app.get("/user-data")
@x.no_cache
def get_data(): 
    user = session.get("user", "")
    if not user:
        return redirect(f"{PageUrl}/login")

    # TODO: USE THIS INSTED OF THE ONE ABOVE
    # if not user: 
    #     return jsonify({"redirect": "/login",
    #                     "status":"User not in session"}),401

    try:    
        q = "SELECT user_first_name, user_last_name, user_email, user_username, user_avatar, user_role FROM `users` WHERE user_pk = %s"
        db,cursor = x.db()
        cursor.execute(q,(user["user_pk"],))
        user = cursor.fetchone()
        ic("XXXXX", user)
        
        return jsonify(user)
    except Exception as e:
        ic(e)
        return jsonify({"status":x.lans("An_error_occurred")}),500
        # session.clear()
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

###################USERS###################################
@app.get("/post-owner")
def get_post_owner(): 
    try:
        post_owner = request.args.get("owner")
        if not post_owner:
            return jsonify({"status":x.lans("owner_not_found")}),400
        q = "SELECT * FROM `users` WHERE user_pk = %s"

        try:
            post_owner = int(post_owner)
        except ValueError:
            return({"status":x.lans("post_owner_invalid")}),400
        db,cursor = x.db()
        cursor.execute(q,(post_owner,))
        owner = cursor.fetchone()
        if not owner:
            return jsonify({"status":x.lans("owner_not_found")}),404
        return jsonify({
            "status": x.lans("post_sent_success"),
            "owner": owner
        }), 200
    except Exception as e:
        ic(e)
        return jsonify({"status":x.lans("An_error_occurred")}),500
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
            
            return jsonify({"redirect": "/"})
        return jsonify({"redirect": "/login"})
        
        
    if request.method == "POST":
        try:
            data = request.get_json()
            if not data:
                return jsonify({"redirect":"/login" ,"status":x.lans("user_info_not_found")}),400
            user_email = data.get("email")
            user_email = x.validate_user_email(user_email)
            user_password = data.get("password")
            ic(user_password)
            q = "SELECT * FROM `users` WHERE user_email = %s"
            db,cursor = x.db()
           
            cursor.execute(q,(user_email,))
            user = cursor.fetchone()  
  
            if not user: raise Exception(x.lans("invalid_email"), 400)   

            if not check_password_hash(user["user_password"], user_password):
                raise Exception(x.lans("invalid_password"), 400)
            
            if user["user_verification_key"] != None:
                raise Exception ("user_not_verified")
            if user["user_block_status"] != "notBlock":
                raise Exception ("user_is_blocked")
            user.pop("user_password")
            session["user"] = user  
        
           
            return jsonify({"redirect": "/"})
        except Exception as e:
            ic(e)     
            if "Inavlid email" in str(e):
                return jsonify({"redirect": "/login",
                   "status": x.lans("Invalid_email_or_password")}),500
            
            if "user_is_blocked" in str(e):
                return jsonify({
                   "status": x.lans("user_is_blocked")}),500
           
            if "user_not_verified" in str(e):
                return jsonify({
                   "status": x.lans("user_not_verified")}),500
           
            if "Invalid password" in str(e):
                return jsonify({"redirect": "/login",
                    "status": x.lans("Invalid_email_or_password")}),500
            return jsonify({"redirect": "/login",
                            "status":x.lans("An_error_occurred")}),500
        finally:
            if "cursor" in locals(): cursor.close()
            if "db" in locals(): db.close()

####################LOGIN OUT############################
@app.post("/logout-submit")
def logout(): 
    try:
        session.clear()
      
        return jsonify({"redirect": "/login",
                        "status":x.lans("logout_success")}),200
    except Exception as e:
        ic(e)
        return jsonify({"status":x.lans("An_error_occurred")}),500
    
           
       
####################SIGNUP SUBMIT############################

@app.route("/signup-submit", methods=["POST"])
def signup_submit():
   
    if request.method == "POST":
        try:
            data = request.get_json()
            if not data:
                return jsonify({"redirect":"/signup"
                ,"status":x.lans("user_info_not_found")}),400
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
            db,cursor = x.db()            
            q = "INSERT INTO users (`user_first_name`, `user_last_name`, `user_username`, `user_education`, `user_school`, `user_email`, `user_password`, `user_verification_key`, `user_verified_at`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(q,(user_first_name, user_last_name, user_username, user_education, user_school, user_email, user_password, user_verification_key, user_verified_at))
            db.commit()
            send_emails.send_verify_email(user_email, user_verification_key)
            return jsonify({"redirect": "/",
                            "status":x.lans("account_created_success")}),200
        except Exception as e: 
            ic(e)
            if "db" in locals():
                db.rollback()
            if "invalid_email" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": x.lans("invalid_email")
                }), 400
            if "first name min 2 max 20 characters" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": x.lans("first_name_length_requirement")
                }), 400
            if "User name to small" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": x.lans("username_length_requirement")
                }), 400
            if "last name min 2 max 20 characters" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": x.lans("last_name_length_requirement")
                }), 400
            if "Duplicate entry" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": x.lans("email_or_username_registered")
                }), 400
            if "Invalid email or password" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": x.lans("password_length_requirement")
                }), 400
            return jsonify({"redirect": "/login",
                            "status":x.lans("An_error_occurred")}),500
        finally:
            if "cursor" in locals(): cursor.close()
            if "db" in locals(): db.close()

####################FORGOT PASSWORD (SEND EMAIL TO RESET PASSWORD)############################
@app.post("/forgot-password")
def forgot_password():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"redirect":"/login"
                ,"status":x.lans("invalid_email")}),400
        user_email = data.get("email")
        user_email = x.validate_user_email(user_email)
        user_token = secrets.token_urlsafe(32)
        user_token_created_at = int(time.time())
        db,cursor = x.db()
        q = "UPDATE `users` SET `user_token`=%s ,`user_token_created_at`=%s WHERE user_email = %s"
        cursor.execute(q,(user_token, user_token_created_at, user_email))
        db.commit()
        send_emails.password_reset_email(user_email, user_token)
        return jsonify({"redirect": "/login",
                        "status":x.lans("password_reset_email_sent")}),200
    except Exception as e:
        ic("PASSWORD WRONG",e)
        if "db" in locals():
            db.rollback()
        if "Invalid email or password" in str(e):
            return jsonify({"redirect": "","status":x.lans("invalid_email")}),400
        return jsonify({"redirect": "/login","status":x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()

####################VERIFY PASSWORD CHANGE(CHANGE OLD PASSWORD TO NEW AFTER EMAIL LINK)############################
@app.post("/update-password")
def update_pasword():
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"redirect":"/login"
                ,"status":x.lans("new_password_not_found")}),400
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
            return jsonify({"status": x.lans("invalid_or_expired_token")}), 400
        return jsonify({"redirect": "/login","status":x.lans("new_password_created")}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
  
        if "Invalid email or password" in str(e):
            return jsonify({"redirect": "","status":x.lans("password_length_requirement")}),400
        return jsonify({"redirect": "/login","status":x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()


####################SESSION CHECK############################ 
@app.get("/session-check")
def session_check():
    user = session.get("user","")

    if user:
       
        return jsonify({"redirect": "/"}),200
    return jsonify({"redirect": None}),200

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

        if not user_verification_key:
            return jsonify({"redirect":"/login","status":x.lans("verification_key_not_found")}),400
        user_verified_at = int(time.time())
        db, cursor = x.db()
        q = "UPDATE users SET user_verification_key = NULL, user_verified_at = %s WHERE user_verification_key = %s"
        cursor.execute(q,(user_verified_at, user_verification_key))
        db.commit()
        if cursor.rowcount != 1: raise Exception("Invalid key", 400)
        return redirect(f"{PageUrl}/")
    except Exception as ex:
        ic(ex)
        
        if "db" in locals(): db.rollback()
  
        if ex.args[1] == 400: 
            return redirect(f"{PageUrl}/login"),400
     
        return redirect(f"{PageUrl}/login"),400
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
        return jsonify(posts),200
    except Exception as e:
        ic(e)
        return jsonify({"status":x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


####################CREATE POST############################
@app.post("/create-post")
def create_post():
    try:
        db,cursor = x.db()
        data = request.get_json()
        if not data:
            return jsonify({"status":x.lans("post_info_not_found")}),400
        post_text = data.get("postText","")
        user = session.get("user", "")
        user_pk = user.get("user_pk","")
        post_created_at = int(time.time())
        q = "INSERT INTO `posts`(`post_text`, `post_created_at`, `user_fk`) VALUES (%s,%s,%s)"
        cursor.execute(q,(post_text, post_created_at, user_pk ))
        db.commit()
        return jsonify({"status": x.lans("post_was_made")}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


####################UPDATE POST############################
@app.patch("/update-post")
def update_post():
    try:
        db,cursor= x.db()
        data = request.get_json()
        if not data:
            return jsonify({"status":x.lans("post_info_not_found")}),400
        post_text = data.get("postText","")
        post_text = post_text.strip()
        if not post_text:
            return jsonify({"status":x.lans("post_text_empty")}),400
            
        post_pk = data.get("post_pk","")
        user = session.get("user", "")
        if not user:
            return jsonify({"status": x.lans("must_be_logged_in")}), 401
        user_pk = user.get("user_pk","")
        post_updated_at = int(time.time())
        q="SELECT 1 FROM `posts` WHERE post_pk = %s AND user_fk = %s"
        cursor.execute(q,(post_pk, user_pk))
        if not cursor.fetchone():
            return jsonify({"status":x.lans("not_post_owner")}),403

        q ="UPDATE `posts` SET `post_text`=%s,`post_updated_at`=%s WHERE post_pk =%s AND user_fk = %s"
        cursor.execute(q,(post_text,post_updated_at,post_pk, user_pk))
        db.commit()
        return jsonify({"status": x.lans("post_is_updated")}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

####################DELETE POST############################
@app.delete("/delete-post")
def delete_post():
   
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"status": x.lans("must_be_logged_in")}), 401
        user_pk = user.get("user_pk","")
        post_pk = request.args.get("post_id")
        if not post_pk:
            return jsonify ({"status":x.lans("post_info_not_found")}),400
        q = "SELECT 1 FROM posts WHERE post_pk = %s AND user_fk = %s"
        cursor.execute(q,(post_pk, user_pk))
        if not cursor.fetchone():
            return jsonify({"status":x.lans("not_post_owner")}),403
        q="DELETE FROM `posts` WHERE post_pk = %s AND user_fk = %s"
        cursor.execute(q,(post_pk, user_pk))
        db.commit()
        return jsonify({"postStatus": x.lans("post_is_deleted")}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"postStatus": x.lans("post_not_deleted")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
####################LIKE############################
@app.get("/like")
def like():
    try:
        db,cursor = x.db()
        post_pk = request.args.get("post_id")
        
        try:
            post_pk = int(post_pk)
        except(TypeError, ValueError):
            return jsonify({"status": x.lans("invalid_post")}), 400
       
        q="SELECT COUNT(user_fk) AS likeCount FROM posts_likes WHERE post_fk = %s"
        cursor.execute(q,(post_pk,))
        user_has_liked = cursor.fetchall()

        return jsonify(user_has_liked),200
    except Exception as e:
        ic(e)
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


####################POST LIKE############################
@app.post("/like-post")
def like_post():
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"redirect":"/login","status":x.lans("must_be_logged_in")}),401
        data = request.get_json()
        if not data:
            return jsonify({"status":x.lans("likes_not_found")}),400
        user_pk = user.get("user_pk","")
        post_pk = data.get("post_pk","")
      
        q="INSERT INTO `posts_likes`(`post_fk`, `user_fk`) VALUES (%s,%s)"
        cursor.execute(q,(post_pk,user_pk))
        db.commit()

        return jsonify({"status": x.lans("post_liked")}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
    

####################LIKE CHECK############################
@app.get("/like-check")
def like_check():
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")})
        user_pk = user.get("user_pk","")
        post_pk = request.args.get("post_id")
        try:
            user_pk = int(user_pk)
        except (ValueError, TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400
        try:
            post_pk = int(post_pk)
        except (ValueError, TypeError):
            return jsonify({"status": x.lans("invalid_post")}), 400

        q="SELECT EXISTS( SELECT 1 FROM posts_likes WHERE post_fk = %s AND user_fk = %s ) AS liked;"
        cursor.execute(q,(post_pk,user_pk))
        user_like_status = cursor.fetchall()

        return jsonify(user_like_status),200
    except Exception as e:
        ic(e)
        
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
      

####################DELETE LIKE############################
@app.delete("/like-delete")
def like_delete():
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")})
        user_pk = user.get("user_pk","")
        try:
            user_pk = int(user_pk)
        except (ValueError, TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400
        post_pk = request.args.get("post_id")
        try:
            post_pk = int(post_pk)
        except (ValueError, TypeError):
            return jsonify({"status": x.lans("invalid_post")}), 400
        q="SELECT 1 FROM `posts_likes` WHERE post_fk=%s AND user_fk = %s;"
        cursor.execute(q,(post_pk,user_pk))
        if not cursor.fetchone():
            return jsonify({"status":x.lans("post_not_liked")}),400
        q="DELETE FROM `posts_likes` WHERE post_fk=%s AND user_fk = %s;"
        cursor.execute(q,(post_pk,user_pk))
        
        db.commit()
        return jsonify({"status": x.lans("post_is_deleted")}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
  


####################SEND COMMENTS############################
@app.post("/post-comments")
def comment_post():
    try:
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")})
        user_pk = user.get("user_pk","")
        try:
            user_pk = int(user_pk)
        except (ValueError, TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400
        db,cursor = x.db()
        data = request.get_json()
        post_pk = data.get("post_pk","")
        try:
            post_pk = int(post_pk)
        except (ValueError, TypeError):
            return jsonify({"status": x.lans("invalid_post")}), 400
        postText = data.get("postText","").strip()
        if not postText:
            return jsonify({"status": x.lans("post_text_empty")}), 400
      
        q="INSERT INTO `posts_comments`(`post_fk`, `user_fk`, `comment_text`) VALUES (%s,%s,%s);"

        cursor.execute(q,(post_pk,user_pk,postText))
        db.commit()
        return jsonify({"status": x.lans("comment_sent")}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()



####################COMMENTS############################
@app.get("/comments")
def comments():
    try:
        db,cursor= x.db()
        post_pk = request.args.get("post_id")
        try:
            post_pk = int(post_pk)
        except (ValueError, TypeError):
            return jsonify({"status": x.lans("invalid_post")}), 400
        q="SELECT * FROM `posts_comments` WHERE post_fk = %s"
        cursor.execute(q,(post_pk,))
        post = cursor.fetchall()
        ic(post,"check fetch")
     
        return jsonify(post),200
       
    except Exception as e:
        ic(e, "COMMENTS")
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

####################COMMENT OWNER############################
@app.get("/comments-owner")
def comments_owner():
    try:
        db,cursor= x.db()
       
        post_pk = request.args.get("user_id")
        try:
            post_pk = int(post_pk)
        except (ValueError, TypeError):
            return jsonify({"status": x.lans("invalid_post")}), 400
        q="SELECT * FROM `users` WHERE user_pk = %s"
        cursor.execute(q,(post_pk,))
        post = cursor.fetchall()
        return jsonify(post),200
    except Exception as e:
        ic(e)
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
####################COMMENTS NUMBER############################
@app.get("/post-comments-number")
def comment_post_number():
    try:
        db,cursor = x.db()
        post_pk = request.args.get("postId")
        try:
            post_pk = int(post_pk)
        except (ValueError, TypeError):
            return jsonify({"status": x.lans("invalid_post")}), 400
        q="SELECT COUNT(comment_pk) AS total_comments FROM posts_comments WHERE post_fk = %s"
        cursor.execute(q,(post_pk,))
        total_comments = cursor.fetchone() 
        return jsonify(total_comments),200
    except Exception as e:
        ic(e)
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()

####################UPDATE PROFILE############################
@app.patch("/update-profile")
def update_profile():
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")}),401
      
        data = request.get_json()
        if not data:
            return jsonify({"status":x.lans("likes_not_found")}),400
        user_email = data.get("emailContent","")
        user_username = data.get("username","")
        user_first_name = data.get("firstName","")
        user_last_name = data.get("lastName","")

        user_first_name = x.validate_user_first_name(user_first_name)   
        user_username = x.validate_user_username(user_username)
        user_email = x.validate_user_email(user_email)
        user_last_name = x.validate_user_last_name(user_last_name)
      
        q ="UPDATE `users` SET `user_first_name`=%s,`user_last_name`=%s,`user_username`=%s,`user_email`=%s WHERE user_pk = %s"
        cursor.execute(q,(user_first_name,user_last_name,user_username,user_email,user["user_pk"]))
        # remeber to validate
        db.commit()
        return jsonify({"postStatus": x.lans("post_is_updated")})
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        if "Duplicate entry" in str(e):
                return jsonify({
             
                    "status": x.lans("email_or_username_registered")
                }), 400
        if "first name min 2 max 20 characters" in str(e):
                return jsonify({
                
                    "status": x.lans("first_name_length_requirement")
                }), 400
        if "last name min 2 max 20 characters" in str(e):
                return jsonify({
                    
                    "status": x.lans("last_name_length_requirement")
                }), 400
        if "invalid_email" in str(e):
                return jsonify({
                    
                    "status": x.lans("invalid_email")
                }), 400
        if "User name to small" in str(e):
                return jsonify({
                    
                    "status": x.lans("username_length_requirement")
                }), 400
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

####################DELETE PROFILE############################
@app.delete("/delete-profile")
def delete_profile():
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")}),401
        q ="DELETE FROM `users` WHERE user_pk = %s"
        cursor.execute(q,(user["user_pk"],))
        db.commit()
        session.clear()
        return redirect(f"{PageUrl}/login")
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

####################UPDATE IMAGE############################
# @app.route('/', methods=['GET', 'POST'])
# def upload_file():
#     if request.method == 'POST':
#         # check if the post request has the file part
#         if 'file' not in request.files:
#             flash('No file part')
#             return jsonify({"PictureStatus": "picture is not a file"})
#             # return redirect(request.url)
#         file = request.files['file']
#         # If the user does not select a file, the browser submits an
#         # empty file without a filename.
#         if file.filename == '':
#             flash('No selected file')
#             return jsonify({"PictureStatus": "file not selected"})
#             # return redirect(request.url)
#         if file and x.allowed_file(file.filename):
#             filename = secure_filename(file.filename)
#             file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#             return jsonify({"PictureStatus": "File is uploaded"})
#             # return redirect(url_for('download_file', name=filename))

####################UPDATE IMAGE############################
@app.patch("/update-profile-avatar")
def update_profile_avatar():
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        user_pk = user.get("user_pk","")
        file = request.files.get("profileAvatar","")
        user_avatar_name = request.form.get("imageName","")
    
        if not user_avatar_name:
            return jsonify({"status": x.lans("file_not_selected")})
        if not file:
            ic(file,"THE AVATAR not a file?")
            ic(user_avatar_name,"TO DATABASE")
            return jsonify({"status": x.lans("file_not_selected")})
            # return redirect(request.url)

        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return jsonify({"status": x.lans("file_not_selected")})
            # return redirect(request.url)
        if file and x.allowed_file(file.filename):
            format = os.path.splitext(secure_filename(file.filename))[1]
            unique_name = f"{uuid.uuid4()}{format}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_name))
            q ="UPDATE `users` SET `user_avatar`=%s WHERE user_pk = %s"
            cursor.execute(q,(unique_name,user_pk))
            db.commit()
            return jsonify({"status": x.lans("file_uploaded")})

      
        return jsonify({"status": x.lans("profile_updated")})
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()


####################GET IMAGE############################
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


####################SEARCH USERS############################
@app.get("/search-users")
def search_users():
    try:
        db,cursor = x.db()
        search_input = request.args.get("search_input")
        q=" SELECT * FROM users WHERE user_username LIKE CONCAT('%', %s, '%')"
        cursor.execute(q,(search_input,))
        search_result = cursor.fetchall()
        for user in search_result:
            user.pop("user_password", None)
        return(search_result)
    except Exception as e:
        ic(e)
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close
        if "cursor" in locals(): cursor.close

####################GET RANDOM USERS############################
@app.get("/search_random-users")
def search_random_users():
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")}),401
        user_pk = user.get("user_pk","")
        try:
            user_pk = int(user_pk)
        except(ValueError,TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400 

        q=" SELECT * FROM `users` WHERE user_pk != %s ORDER BY RAND() LIMIT 3"
        cursor.execute(q,(user_pk,))
        search_result = cursor.fetchall()
        for user in search_result:
            user.pop("user_password", None)
        return(search_result),200
    except Exception as e:
        ic(e)
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close
        if "cursor" in locals(): cursor.close

####################FOLLOW USER############################
@app.post("/follow-user")
def follow_user():
    try:
        db,cursor=x.db()
        data = request.get_json()
        if not data:
            return jsonify({"status":x.lans("likes_not_found")}),400
        following_id = data.get("user_pk","")
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")}),401
        follower_id = user.get("user_pk","")
        try:
            follower_id = int(follower_id)
        except(ValueError,TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400 
        q="INSERT INTO `followers`(`follower_id`, `following_id`) VALUES (%s,%s)"
        cursor.execute(q,(follower_id,following_id))
        db.commit()
        return jsonify({"status": x.lans("following_is_working")}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()

####################UNFOLLOW USER############################
@app.delete("/unfollow-user")
def unfollow_user():
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")}),401
        follower_id = user.get("user_pk","")
        try:
            follower_id = int(follower_id)
        except(ValueError,TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400 
        following_id= request.args.get("follower_id")
        try:
            following_id = int(following_id)
        except(ValueError,TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400 
        q="DELETE FROM `followers` WHERE follower_id = %s AND following_id = %s"
        cursor.execute(q,(follower_id,following_id))
        db.commit()
        return jsonify({"status":x.lans("user_unfollowed")}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()
####################FOLLOWING CHECK############################
@app.get("/following-check")
def following_check():
    try:
        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")}),401
        follower_id = user.get("user_pk","")
        try:
            follower_id = int(follower_id)
        except(ValueError,TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400 
        following_id = request.args.get("follower_id")
        try:
            following_id = int(following_id)
        except(ValueError,TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400 
        q="SELECT EXISTS( SELECT 1 FROM followers WHERE follower_id = %s AND following_id = %s ) AS followed;"
        cursor.execute(q,(follower_id,following_id))
        user_follow_status = cursor.fetchall()
        return jsonify(user_follow_status),200
    except Exception as e:
        ic(e)
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()

###############ADMIN GET USERS#############
@app.get("/admin-users")
def admin_users():
    try:

        db,cursor = x.db()
        user = session.get("user", "")
        if not user:
            return jsonify({"status":x.lans("must_be_logged_in")}),401
        user_id = user.get("user_pk","")
        user_role = user.get("user_role","")
        ic(user_id)
        q = "SELECT 1 FROM users WHERE user_pk=%s AND user_role='admin'"
        cursor.execute(q, (user_id,))

        row = cursor.fetchone()
        if row is None:
            return jsonify({"status": "You are not an admin"}), 403
      
        ic(user_role)
        q="SELECT `user_pk`, `user_first_name`, `user_last_name`, `user_username`, `user_email`, `user_avatar`, `user_role`, `user_block_status` FROM `users` WHERE user_role = 'user'"
        cursor.execute(q,)
        allUser=cursor.fetchall()
        ic(allUser,"all users")
        return jsonify(allUser)
    except Exception as e:
        ic(e)
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()
###############ADMIN BLOCK USERS STATUS#############
@app.post("/admin-block-users")
def admin_block_users():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status":x.lans("likes_not_found")}),400
        user_pk = data.get("user_pk","")
        user_email = data.get("user_email","")
      
        blockStatus = data.get("newStatus","")
       
        db,cursor = x.db()
        q="UPDATE `users` SET `user_block_status`=%s WHERE user_pk = %s"
        cursor.execute(q,(blockStatus,user_pk))
        db.commit()
        send_emails.block_email(user_email)
        
        return jsonify({"status":x.lans("user_is_blocked")}),200
    except Exception as e:
        ic(e)
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "db" in locals(): db.close()
        if "cursor" in locals(): cursor.close()
##############USERS BLOCK CHECK#############
@app.get("/block-check")
def block_check():
    try:
        db,cursor = x.db()
       
        user_id = request.args.get("user_id")
        
        try:
            user_id = int(user_id)
        except(ValueError,TypeError):
            return jsonify({"status": x.lans("invalid_user")}), 400 
        q="SELECT EXISTS(SELECT 1 FROM `users` WHERE user_pk = %s AND user_block_status = 'notBlock') AS userStatus"
        cursor.execute(q, (user_id,))

        user_block_status = cursor.fetchone()
      
        return jsonify(user_block_status),200
    except Exception as e:
        ic(e)
        return jsonify({"status": x.lans("An_error_occurred")}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()



###############GET DATA FORM GOOGLE SHEET#############
@app.get("/get-data-from-sheet")
def get_data_from_sheet():
    try:
 
        # Check if the admin is running this end-point, else show error
 
        # flaskwebmail
        # Create a google sheet
        # share and make it visible to "anyone with the link"
        # In the link, find the ID of the sheet. Here: 1aPqzumjNp0BwvKuYPBZwel88UO-OC_c9AEMFVsCw1qU
        # Replace the ID in the 2 places bellow
        url= f"https://docs.google.com/spreadsheets/d/{x.google_spread_sheet_key}/export?format=csv&id={x.google_spread_sheet_key}"
        res=requests.get(url=url)
        # ic(res.text) # contains the csv text structure
        csv_text = res.content.decode('utf-8')
        csv_file = io.StringIO(csv_text) # Use StringIO to treat the string as a file
       
        # Initialize an empty list to store the data
        data = {}
 
        # Read the CSV data
        reader = csv.DictReader(csv_file)
        ic(reader)
        # Convert each row into the desired structure
        for row in reader:
            item = {
                    'english': row['english'],
                    'danish': row['danish'],
                    'spanish': row['spanish']
               
            }
            # Append the dictionary to the list
            data[row['key']] = (item)
 
        # Convert the data to JSON
        json_data = json.dumps(data, ensure_ascii=False, indent=4)
        # ic(data)
 
        # Save data to the file
        with open("dictionary.json", 'w', encoding='utf-8') as f:
            f.write(json_data)
 
        return "ok"
    except Exception as ex:
        ic(ex)
        return str(ex)
    finally:
        pass