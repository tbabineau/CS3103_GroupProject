from smtplib import SMTP_SSL
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def sendEmail(recipient, hash, url):
    smtpObj = SMTP_SSL("smtp.gmail.com", 465)
    smtpObj.ehlo()
    smtpObj.login('tylerkbabineau@gmail.com', 'nrdfizifvapawvnj')

    mail = MIMEMultipart("alternative")
    from_address = 'no-reply_CS3103shop@unb.ca'
    message = f"""\
    <html>
        <body>
            <form>
                Hello!<br><br>

                Thank you for signing up for our store!<br>
                Please click <a href = "https://{url}/verify/{hash}">here</a> to verify your email.<br><br>

                Sincerely,<br>
                -The CS3103 shop team
            </form>
        </body>
    </html>
    """
    mail["From"] = from_address
    mail["To"] = recipient
    mail["Subject"] = "Please verify your email"
    mail.attach(MIMEText(message, "html"))
    smtpObj.sendmail(from_address, recipient, mail.as_string())

    # Quit the SMTP session
    smtpObj.quit()