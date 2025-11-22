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
# import requests


from icecream import ic
ic.configureOutput(prefix=f'----- | ', includeContext=True)


app = Flask(__name__)
CORS(app)

# WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
# if __name__ == "__main__":
#     app.run(debug=True)

@app.get("/user-data")
def get_data(): 

    try:
        q = "SELECT user_first_name FROM `users` WHERE user_pk = 1"
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

    # users = [
    #     {'id': 1, 'username': 'sweety'},
    #     {'id': 2, 'username': 'pallavi'}
    # ]
    # ic("pls",users)
    # return jsonify(users)
    # return jsonify({"message": "hello"})


    # SELECT user_first_name FROM `users` WHERE user_pk = 1;