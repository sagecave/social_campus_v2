
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

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:3000"],allow_headers=["Content-Type"], expose_headers=["Content-Type"])

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
###################USER DATA FOR HOME###################################
# TODO: change the url name to make more sense this is the home page
@app.get("/user-data")
@x.no_cache
def get_data(): 
    user = session.get("user", "")
    if not user:
        return redirect("http://127.0.0.1:3000/login")

    # TODO: USE THIS INSTED OF THE ONE ABOVE
    # if not user: 
    #     return jsonify({"redirect": "/login",
    #                     "status":"User not in session"}),401

    try:    
        q = "SELECT user_first_name, user_last_name, user_email, user_username, user_avatar FROM `users` WHERE user_pk = %s"
        db,cursor = x.db()
        cursor.execute(q,(user["user_pk"],))
        user = cursor.fetchone()
        ic("XXXXX", user)
        
        return jsonify(user)
    except Exception as e:
        ic(e)
        return jsonify({"status":"An error occurred"}),500
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
            return jsonify({"status":"Owner of this post is not found"}),400
        q = "SELECT * FROM `users` WHERE user_pk = %s"

        try:
            post_owner = int(post_owner)
        except ValueError:
            return({"status":"Post owner is invalid"}),400
        db,cursor = x.db()
        cursor.execute(q,(post_owner,))
        owner = cursor.fetchone()
        if not owner:
            return jsonify({"status":"Owner not found"}),404
        return jsonify({
            "status": "Success post is send",
            "owner": owner
        }), 200
    except Exception as e:
        ic(e)
        return jsonify({"status":"An error occurred"}),500
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
                return jsonify({"redirect":"/login" ,"status":"User information not found"}),400
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
            
            if user["user_verification_key"] != None:
                raise Exception ("user not verified")
            user.pop("user_password")
            session["user"] = user  
        
           
            return jsonify({"redirect": "/"})
        except Exception as e:
            ic(e)     
            if "Inavlid email" in str(e):
                return jsonify({"redirect": "/login",
                    "status":"Invalid email or password"}),500
            if "Invalid password" in str(e):
                return jsonify({"redirect": "/login",
                    "status":"Invalid email or password"}),500
            return jsonify({"redirect": "/login",
                            "status":"An error occurred"}),500
        finally:
            if "cursor" in locals(): cursor.close()
            if "db" in locals(): db.close()

####################LOGIN OUT############################
@app.post("/logout-submit")
def logout(): 
    try:
        session.clear()
      
        return jsonify({"redirect": "/login",
                        "status":"Logout success"}),200
    except Exception as e:
        ic(e)
        return jsonify({"status":"An error occurred"}),500
    
           
       
####################SIGNUP SUBMIT############################

@app.route("/signup-submit", methods=["POST"])
def signup_submit():
   
    if request.method == "POST":
        try:
            data = request.get_json()
            if not data:
                return jsonify({"redirect":"/signup"
                ,"status":"User information not found"}),400
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
                            "status":"You have successfully created an account"}),200
        except Exception as e: 
            ic(e)
            if "db" in locals():
                db.rollback()
            if "invalid_email" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": "Invalid email "
                }), 400
            if "first name min 2 max 20 characters" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": "First name must be between 2 and 20 characters"
                }), 400
            if "User name to small" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": "Username must be between 2 and 20 characters"
                }), 400
            if "last name min 2 max 20 characters" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": "Last name must be between 2 and 20 characters"
                }), 400
            if "Duplicate entry" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": "Email or username already registered"
                }), 400
            if "Invalid email or password" in str(e):
                return jsonify({
                    "redirect": "/login", 
                    "status": "Password must be between 6 and 50 characters"
                }), 400
            return jsonify({"redirect": "/login",
                            "status":"An error occurred, signup failed"}),500
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
                ,"status":"User email was not found"}),400
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
                        "status":"We have sent you an email to reset your password"}),200
    except Exception as e:
        ic("PASSWORD WRONG",e)
        if "db" in locals():
            db.rollback()
        if "Invalid email or password" in str(e):
            return jsonify({"redirect": "","status":"Email is does not exists"}),400
        return jsonify({"redirect": "/login","status":"An error occurred"}),500
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
                ,"status":"User new password was not found"}),400
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
            return jsonify({"status": "Invalid or expired token"}), 400
        return jsonify({"redirect": "/login","status":"You have created a new password"}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
  
        if "Invalid email or password" in str(e):
            return jsonify({"redirect": "","status":"Password must be between 6 and 50 characters"}),400
        return jsonify({"redirect": "/login","status":"An error occurred"}),500
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
            return jsonify({"redirect":"/login","status":"Verification key not found"}),400
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
  
        if ex.args[1] == 400: 
            return redirect("http://127.0.0.1:3000/login"),400
     
        return redirect("http://127.0.0.1:3000/login"),400
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
        return jsonify({"status":"An error occurred"}),500
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
            return jsonify({"status":"Post information not found"}),400
        post_text = data.get("postText","")
        user = session.get("user", "")
        user_pk = user.get("user_pk","")
        post_created_at = int(time.time())
        q = "INSERT INTO `posts`(`post_text`, `post_created_at`, `user_fk`) VALUES (%s,%s,%s)"
        cursor.execute(q,(post_text, post_created_at, user_pk ))
        db.commit()
        return jsonify({"status": "Post was made"}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status":"Post update information not found"}),400
        post_text = data.get("postText","")
        post_text = post_text.strip()
        if not post_text:
            return jsonify({"status":"Post text cannot be empty"}),400
            
        post_pk = data.get("post_pk","")
        user = session.get("user", "")
        if not user:
            return jsonify({"status": "You must be logged in"}), 401
        user_pk = user.get("user_pk","")
        post_updated_at = int(time.time())
        q="SELECT 1 FROM `posts` WHERE post_pk = %s AND user_fk = %s"
        cursor.execute(q,(post_pk, user_pk))
        if not cursor.fetchone():
            return jsonify({"status":"You don´t own this post"}),403

        q ="UPDATE `posts` SET `post_text`=%s,`post_updated_at`=%s WHERE post_pk =%s AND user_fk = %s"
        cursor.execute(q,(post_text,post_updated_at,post_pk, user_pk))
        db.commit()
        return jsonify({"status": "Post is updated"}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": "PAn error occurred"}),500
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
            return jsonify({"status": "You must be logged in"}), 401
        user_pk = user.get("user_pk","")
        post_pk = request.args.get("post_id")
        if not post_pk:
            return jsonify ({"status":"Post not found"}),400
        q = "SELECT 1 FROM posts WHERE post_pk = %s AND user_fk = %s"
        cursor.execute(q,(post_pk, user_pk))
        if not cursor.fetchone():
            return jsonify({"status":"You don´t own this post"}),403
        q="DELETE FROM `posts` WHERE post_pk = %s AND user_fk = %s"
        cursor.execute(q,(post_pk, user_pk))
        db.commit()
        return jsonify({"postStatus": "Post is deleted"}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"postStatus": "Post did not deleted"}),500
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
            return jsonify({"status": "Invalid post"}), 400
       
        q="SELECT COUNT(user_fk) AS likeCount FROM posts_likes WHERE post_fk = %s"
        cursor.execute(q,(post_pk,))
        user_has_liked = cursor.fetchall()

        return jsonify(user_has_liked),200
    except Exception as e:
        ic(e)
        return jsonify({"status": "PAn error occurred"}),500
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
            return jsonify({"redirect":"/login","status":"You must be logged in"}),401
        data = request.get_json()
        if not data:
            return jsonify({"status":"Likes not found"}),400
        user_pk = user.get("user_pk","")
        post_pk = data.get("post_pk","")
      
        q="INSERT INTO `posts_likes`(`post_fk`, `user_fk`) VALUES (%s,%s)"
        cursor.execute(q,(post_pk,user_pk))
        db.commit()

        return jsonify({"status": "You have liked a post"}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": "PAn error occurred"}),500
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
            return jsonify({"status":"You must be logged in"})
        user_pk = user.get("user_pk","")
        post_pk = request.args.get("post_id")
        try:
            user_pk = int(user_pk)
        except (ValueError, TypeError):
            return jsonify({"status": "Invalid user"}), 400
        try:
            post_pk = int(post_pk)
        except (ValueError, TypeError):
            return jsonify({"status": "Invalid post"}), 400

        q="SELECT EXISTS( SELECT 1 FROM posts_likes WHERE post_fk = %s AND user_fk = %s ) AS liked;"
        cursor.execute(q,(post_pk,user_pk))
        user_like_status = cursor.fetchall()

        return jsonify(user_like_status),200
    except Exception as e:
        ic(e)
        
        return jsonify({"status": "PAn error occurred"}),500
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
            return jsonify({"status":"You must be logged in"})
        user_pk = user.get("user_pk","")
        try:
            user_pk = int(user_pk)
        except (ValueError, TypeError):
            return jsonify({"status": "Invalid user"}), 400
        post_pk = request.args.get("post_id")
        try:
            post_pk = int(post_pk)
        except (ValueError, TypeError):
            return jsonify({"status": "Invalid post"}), 400
        q="SELECT 1 FROM `posts_likes` WHERE post_fk=%s AND user_fk = %s;"
        cursor.execute(q,(post_pk,user_pk))
        if not cursor.fetchone():
            return jsonify({"status":"This post is not liked"}),400
        q="DELETE FROM `posts_likes` WHERE post_fk=%s AND user_fk = %s;"
        cursor.execute(q,(post_pk,user_pk))
        
        db.commit()
        return jsonify({"status": "Post did not deleted"}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": "An error occurred"}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
  


####################SEND COMMENTS############################
@app.post("/post-comments")
def comment_post():
    try:
        user = session.get("user", "")
        if not user:
            return jsonify({"status":"You must be logged in"})
        user_pk = user.get("user_pk","")
        try:
            user_pk = int(user_pk)
        except (ValueError, TypeError):
            return jsonify({"status": "Invalid user"}), 400
        db,cursor = x.db()
        data = request.get_json()
        post_pk = data.get("post_pk","")
        try:
            post_pk = int(post_pk)
        except (ValueError, TypeError):
            return jsonify({"status": "Invalid post"}), 400
        postText = data.get("postText","").strip()
        if not postText:
            return jsonify({"status": "You can’t comment an empty post"}), 400
      
        q="INSERT INTO `posts_comments`(`post_fk`, `user_fk`, `comment_text`) VALUES (%s,%s,%s);"

        cursor.execute(q,(post_pk,user_pk,postText))
        db.commit()
        return jsonify({"status": "You have sent a comment"}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status": "Invalid post"}), 400
        q="SELECT * FROM `posts_comments` WHERE post_fk = %s"
        cursor.execute(q,(post_pk,))
        post = cursor.fetchall()
        ic(post,"check fetch")
     
        return jsonify(post),200
       
    except Exception as e:
        ic(e, "COMMENTS")
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status": "Invalid post"}), 400
        q="SELECT * FROM `users` WHERE user_pk = %s"
        cursor.execute(q,(post_pk,))
        post = cursor.fetchall()
        return jsonify(post),200
    except Exception as e:
        ic(e)
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status": "Invalid post"}), 400
        q="SELECT COUNT(comment_pk) AS total_comments FROM posts_comments WHERE post_fk = %s"
        cursor.execute(q,(post_pk,))
        total_comments = cursor.fetchone() 
        return jsonify(total_comments),200
    except Exception as e:
        ic(e)
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status":"You must be logged in"}),401
      
        data = request.get_json()
        if not data:
            return jsonify({"status":"Likes not found"}),400
        user_email = data.get("email","")
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
        return jsonify({"postStatus": "Profile is update"})
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        if "Duplicate entry" in str(e):
                return jsonify({
             
                    "status": "Email or username already registered"
                }), 400
        if "first name min 2 max 20 characters" in str(e):
                return jsonify({
                
                    "status": "First name min 2 max 20 characters"
                }), 400
        if "last name min 2 max 20 characters" in str(e):
                return jsonify({
                    
                    "status": "Last name min 2 max 20 characters"
                }), 400
        if "invalid_email" in str(e):
                return jsonify({
                    
                    "status": "Invalid email"
                }), 400
        if "User name to small" in str(e):
                return jsonify({
                    
                    "status": "Username min 2 max 20 characters"
                }), 400
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status":"You must be logged in"}),401
        q ="DELETE FROM `users` WHERE user_pk = %s"
        cursor.execute(q,(user["user_pk"],))
        db.commit()
        session.clear()
        return redirect("http://127.0.0.1:3000/login")
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status": "file not selected"})
        if not file:
            ic(file,"THE AVATAR not a file?")
            ic(user_avatar_name,"TO DATABASE")
            return jsonify({"status": "file not selected"})
            # return redirect(request.url)

        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return jsonify({"status": "file not selected"})
            # return redirect(request.url)
        if file and x.allowed_file(file.filename):
            format = os.path.splitext(secure_filename(file.filename))[1]
            unique_name = f"{uuid.uuid4()}{format}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_name))
            q ="UPDATE `users` SET `user_avatar`=%s WHERE user_pk = %s"
            cursor.execute(q,(unique_name,user_pk))
            db.commit()
            return jsonify({"status": "File is uploaded"})

      
        return jsonify({"status": "Profile is update"})
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": "An error occurred"}),500
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
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status":"You must be logged in"}),401
        user_pk = user.get("user_pk","")
        try:
            user_pk = int(user_pk)
        except(ValueError,TypeError):
            return jsonify({"status": "Invalid user"}), 400 

        q=" SELECT * FROM `users` WHERE user_pk != %s ORDER BY RAND() LIMIT 3"
        cursor.execute(q,(user_pk,))
        search_result = cursor.fetchall()
        for user in search_result:
            user.pop("user_password", None)
        return(search_result),200
    except Exception as e:
        ic(e)
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status":"Likes not found"}),400
        following_id = data.get("user_pk","")
        user = session.get("user", "")
        if not user:
            return jsonify({"status":"You must be logged in"}),401
        follower_id = user.get("user_pk","")
        try:
            follower_id = int(follower_id)
        except(ValueError,TypeError):
            return jsonify({"status": "Invalid user"}), 400 
        q="INSERT INTO `followers`(`follower_id`, `following_id`) VALUES (%s,%s)"
        cursor.execute(q,(follower_id,following_id))
        db.commit()
        return jsonify({"followingStatus": "following is working"}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status":"You must be logged in"}),401
        follower_id = user.get("user_pk","")
        try:
            follower_id = int(follower_id)
        except(ValueError,TypeError):
            return jsonify({"status": "Invalid user"}), 400 
        following_id= request.args.get("follower_id")
        try:
            following_id = int(following_id)
        except(ValueError,TypeError):
            return jsonify({"status": "Invalid user"}), 400 
        q="DELETE FROM `followers` WHERE follower_id = %s AND following_id = %s"
        cursor.execute(q,(follower_id,following_id))
        db.commit()
        return jsonify({"status":"User unfollowed"}),200
    except Exception as e:
        ic(e)
        if "db" in locals():
            db.rollback()
        return jsonify({"status": "An error occurred"}),500
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
            return jsonify({"status":"You must be logged in"}),401
        follower_id = user.get("user_pk","")
        try:
            follower_id = int(follower_id)
        except(ValueError,TypeError):
            return jsonify({"status": "Invalid user"}), 400 
        following_id = request.args.get("follower_id")
        try:
            following_id = int(following_id)
        except(ValueError,TypeError):
            return jsonify({"status": "Invalid user"}), 400 
        q="SELECT EXISTS( SELECT 1 FROM followers WHERE follower_id = %s AND following_id = %s ) AS followed;"
        cursor.execute(q,(follower_id,following_id))
        user_follow_status = cursor.fetchall()
        return jsonify(user_follow_status),200
    except Exception as e:
        ic(e)
        return jsonify({"status": "An error occurred"}),500
    finally:
        if "cursor" in locals(): cursor.close()
        if "db" in locals(): db.close()
      