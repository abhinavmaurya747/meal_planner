from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
users_db = SQLAlchemy()


class MealUserData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(255))
    date = db.Column(db.String(255))
    meal_data = db.Column(db.JSON)


class User(db.Model):
    __bind_key__ = 'users_db'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    password = db.Column(db.String(120), nullable=False)
