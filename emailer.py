from smtplib import SMTP
import email

def sendEmail(recipient, hash, url):
    smtpObj = SMTP("smtp.unb.ca", 25)
    smtpObj.ehlo()

    mail = email.message.EmailMessage()
    from_address = 'no-reply_CS3103shop@unb.ca'
    message = f"""\
        Hello!

        Thank you for signing up for our store! 
        Please click here to veryify your email: {url}/{hash}.

        Sincerely,
        -The CS3103 shop team
    """
    print(message)
    mail.add_header("From", from_address)
    mail.add_header("To", recipient)
    mail.add_header("Subject", "Please verify your email")
    mail.set_content(message)
    smtpObj.sendmail(from_address, recipient, mail.as_string())

    # Quit the SMTP session
    smtpObj.quit()
sendEmail("tbabine1@unb.ca", "ABCDEF", "https://CS3103.cs.unb.ca:8002/verify")