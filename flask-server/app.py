from flask import Flask, jsonify, request, render_template, session, send_file
from flask_cors import CORS
import openai
from scheduler import *
from recipe_finder import *
from recommendations import *
from dotenv import load_dotenv, find_dotenv
from models import db, users_db, MealUserData, User
from werkzeug.security import check_password_hash, generate_password_hash
import datetime
import json
from collections import OrderedDict
# For generating PDF
from utils import create_pdf


# from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user


_ = load_dotenv(find_dotenv())  # read local .env file

openai.api_key = os.environ['OPENAI_API_KEY']

app = Flask(__name__)
app.config['SECRET_KEY'] = 'meal_planner_application'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///meal_database.db'
# Define a binding for the second database
app.config['SQLALCHEMY_BINDS'] = {'users_db': 'sqlite:///users.db'}

CORS(app)
# login_manager = LoginManager(app)

with app.app_context():
    db.init_app(app)
    db.create_all()


@app.route('/store_user_meal_details', methods=['POST'])
def store_meal():
    try:
        with app.app_context():
            if request.method == 'POST':
                meal_data = request.json.get("meal_data")
                user = request.json.get("user")
                date = datetime.datetime.now()

                user_meal_data = MealUserData(
                    meal_data=meal_data, user=user, date=date)

                # Add the sample data to the database
                db.session.add(user_meal_data)
                db.session.commit()
        # Return a response to the client
        return "True"
    except Exception as e:
        print(f"Exception occured while storing in db :\n{e}")
        return "False"


''''''
# save a temp.txt file in history directory to store the latest data
''''''


def store_meal_to_db(user):
    try:
        meal_data = ""
        with open("history/temp.json") as file:
            meal_data = json.load(file)

        with app.app_context():
            date = datetime.datetime.now()
            user_meal_data = MealUserData(
                meal_data=meal_data, user=user, date=date)

            db.session.add(user_meal_data)
            db.session.commit()

        return "True"
    except:
        return "False"


@app.route('/getSuggestedRecipe', methods=['POST'])
async def get_suggested_recipe():
    try:
        data = request.json
        meal_name = data['selectedCell']
        print(meal_name)
        recipeFinder = RecipeFinder(meal_name)
        recipe = await recipeFinder.find_recipe()
        ingredients = await recipeFinder.find_ingredients()
        print(recipe, ingredients)
        return {"suggestedRecipe": recipe["suggestedRecipe"], "ingredients": ingredients["ingredients"]}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_plan', methods=['POST'])
async def get_plan():
    try:
        data = request.json
        print(data)
        meal_requirements = data.get('meal_requirements', {})

        if not meal_requirements:
            return jsonify({"error": "No meal requirements provided."}), 400

        print("User Sent : ", meal_requirements)

        sch = Schedulder(meal_requirements)
        json_data = await sch.planner()
        # left_day = await sch.find_leftover_takeout()
        # final_treats = await sch.find_treats()
        sch.dump()

        # json_data = json_data[:-1] + "," + \
        #     left_day[1:-1] + "," + final_treats[1:]
        status = store_meal_to_db(user="user_temp")
        print(json_data)
        print(status)
        return json_data
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_genre_recommendation', methods=['POST'])
async def get_genre_recommendation():
    try:
        data = request.json
        user_genres = data.get('genres', {})
        print(user_genres)

        if not user_genres:
            return jsonify({"error": "No meal requirements provided."}), 400

        rec = GenreRecommendations(user_genres)
        json_data = await rec.get_more_genres()
        print(json_data)
        return json_data
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_meal_recommendation', methods=['POST'])
async def get_meal_recommendation():
    try:
        data = request.json
        user_meals = data.get('genres', {})
        print(user_meals)

        if not user_meals:
            return jsonify({"error": "No meal requirements provided."}), 400

        rec = MealRecommendations(user_meals)
        json_data = await rec.get_more_meals()
        print(json_data)
        return json_data
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generate_pdf_file', methods=['POST'])
async def generate_pdf_file():
    try:
        data = request.json
        # Order the days if data is unordered
        ordered_meal_plan = {day: data['meal_plan'][day] for day in [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
        data['meal_plan'] = ordered_meal_plan
        # Add code to add data into a table in a pdf file
        pdf_filename = "meal_plan.pdf"
        create_pdf(data, pdf_filename)
        return jsonify({"message": "PDF created successfully", "filename": pdf_filename})
    except Exception as e:
        # Log the exception for debugging
        app.logger.error(f"Error creating PDF: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/download_pdf_file', methods=['GET'])
async def download_pdf_file():
    try:
        filename = 'meal_plan.pdf'
        return send_file(filename, as_attachment=True, mimetype='application/pdf')
    except Exception as e:
        app.logger.error(f"Error downloading PDF to frontend: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/getUserMealDetails', methods=['POST'])
async def getUserMealDetails():
    try:
        meal_data_list = []
        with app.app_context():
            all_meals_data = MealUserData.query.all()
            print(all_meals_data)
            for meal_data in all_meals_data:
                meal_data_list.append({
                    'meal_data': meal_data.meal_data,
                    'user': meal_data.user,
                    'date': meal_data.date,
                    'uid': meal_data.id
                })
        return jsonify({'all_meal_data': meal_data_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = generate_password_hash(
            data.get('password'), method='pbkdf2:sha256')  # Use 'pbkdf2:sha256'
        with app.app_context():
            new_user = User(username=username, password=password, email=email)
            db.session.add(new_user)
            db.session.commit()
        return jsonify({"message": "User created", "ok": True})
    except Exception as e:
        return jsonify({"message": "Choose different username/password", "ok": False, "error": str(e)})


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username_email = data.get('username')  # Use get to avoid KeyError
    password = data.get('password')

    print(username_email, password)
    user = User.query.filter_by(username=username_email).first()
    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        return jsonify({"message": "success"})

    user = User.query.filter_by(email=username_email).first()
    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        return jsonify({"message": "success"})

    return jsonify({"message": "failed"})


if __name__ == '__main__':
    app.run(debug=True)
