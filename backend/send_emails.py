from flask import request, make_response, render_template
import mysql.connector
from email_validator import validate_email, EmailNotValidError
import re 

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from functools import wraps

from icecream import ic

############VERIFICATION OF USER EMAIL##################
def send_verify_email(user_email, user_verification_key):
    try:
        # Create a gmail fullflaskdemomail
        # Enable (turn on) 2 step verification/factor in the google account manager
        # Visit: https://myaccount.google.com/apppasswords
        # Copy the key

        # Email and password of the sender's Gmail account
        sender_email = "andreassage@gmail.com"
        password = "pthx nszm mlwm ydau"  # If 2FA is on, use an App Password instead

        # Receiver email address
        receiver_email = user_email
        
        # Create the email message
        message = MIMEMultipart()
        message["From"] = "Social Campus"
        message["To"] = receiver_email
        message["Subject"] = "Please verify your account"

        # Body of the email
        body = f"""To verify your account, please <a href="http://127.0.0.1:80/verify-account?key={user_verification_key}">click here</a>"""
        message.attach(MIMEText(body, "html"))

        # Connect to Gmail's SMTP server and send the email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Upgrade the connection to secure
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("Email sent successfully!")

        return "email sent"
       
    except Exception as ex:
        ic("Send email",ex)
        raise Exception("cannot send email", 500)
    finally:
        pass



############RESET PASSWORD EMAIL##################
def password_reset_email(user_email, user_token):
    try:
        # Create a gmail fullflaskdemomail
        # Enable (turn on) 2 step verification/factor in the google account manager
        # Visit: https://myaccount.google.com/apppasswords
        # Copy the key

        # Email and password of the sender's Gmail account
        sender_email = "andreassage@gmail.com"
        password = "pthx nszm mlwm ydau"  # If 2FA is on, use an App Password instead

        # Receiver email address
        receiver_email = user_email
        
        # Create the email message
        message = MIMEMultipart()
        message["From"] = "Social Campus"
        message["To"] = receiver_email
        message["Subject"] = "Change your account password"

        # Body of the email
        body = f"""To change your password please <a href="http://127.0.0.1:3000/reset_password?key={user_token}">click here</a>"""
        message.attach(MIMEText(body, "html"))

        # Connect to Gmail's SMTP server and send the email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Upgrade the connection to secure
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("Email sent successfully!")

        return "email sent"
        
    except Exception as ex:
        ic("Send email",ex)
        raise Exception("cannot send email", 500)
    finally:
        pass