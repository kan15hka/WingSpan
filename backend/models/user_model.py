from db import db
class UserModel(db.Model):
    __tablename__="users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50),nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    contact_number= db.Column(db.String(50),nullable=False)
    dob= db.Column(db.String(50),nullable=False)
    gender= db.Column(db.String(50),nullable=False)
    nationality= db.Column(db.String(50),nullable=False)

