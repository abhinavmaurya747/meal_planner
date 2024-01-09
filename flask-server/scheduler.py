from openai_utils import get_completion_from_messages
from datetime import datetime
import json
import os
import random

# if avoid_foods == "":
#     avoid_foods = "nothing"
# if allergic_foods == "":
#     allergic_foods = "nothing"


class Schedulder:
    def __init__(self, meal_requirements):
        self.meal_requirements = meal_requirements
        self.message = None
        self.usage = None
        self.response = None
        self.json_data = None
        self.final_treat_items = None
        self.ignore_days = None
        self.json_dump_path = "history"
        self.vegan_check = meal_requirements['veganCheck']
        self.food_genre = meal_requirements['food_genre']
        # self.preferred_foods = meal_requirements['preffered_foods']
        self.dairy = meal_requirements['dairy']
        self.protein = meal_requirements['protein']
        self.fruits = meal_requirements['fruits']
        self.vegetables = meal_requirements['vegetables']
        self.starch = meal_requirements['starch']
        self.avoid_foods = meal_requirements['avoid_foods']
        self.allergic_foods = meal_requirements['allergic_foods']
        self.treats = meal_requirements['treats']
        self.leftover_days = meal_requirements['leftover_days']
        self.takeout_days = meal_requirements['takeout_days']

        if self.avoid_foods == "":
            self.avoid_foods = "none"
        if self.allergic_foods == "":
            self.allergic_foods = "none"
        if self.leftover_days == "":
            self.leftover_days = "never"
        if self.takeout_days == "":
            self.takeout_days = "never"
        if self.treats == "":
            self.treats = "none"

        self.week_day_names = """ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" """
        self.meals = """breakfast, morning_snacks, lunch, afternoon_snacks, dinner"""

    def create_message(self, system_message, assistant_message, user_message):
        """
            Used to create the prompt to get the meal plan and ingredients list from GPT.
        """
        messages = [
            {'role': 'system',
             'content': system_message},
            {'role': 'assistant',
             'content': assistant_message},
            {'role': 'user',
             'content': f"""{user_message}"""},
        ]

        self.message = messages

        return messages

    def get_planner_prompt(self):
        system_message = f"""You are a highly qualified nutritionist whose role is to understand users food pattern \
            and provide them a desired meal plan.
            Respond in a friendly and helpful tone, \
                with very concise answers. \
                    Make sure to go through user messages several times before providing any result."""

        assistant_message = f"""I will provide you a desired complete meal plan for all 7 days with no other text."""
        hidden_requests = """\
            1. at least 6 grams of fiber per meal\
            2. at least 10 grams of protein per meal\
            3. less than 25 grams of added sugar per day\
            4. include treat to be scheduled 3 times per week with dinner\
            5. for snacks, include at least 2 food groups\
            """

        # Delimiters can be anything like: ```, """, < >, <tag> </tag>, :

        ingredient_list_example = """"ingredients_list": {
        "Chicken tacos": "Chicken breast, Taco shells, Lettuce, Tomato, Onion, Avocado"
        "Fruit salad": "Assorted fruits (such as berries, melon, and grapes)"
        }"""
        suggested_recipe_example = """"suggested_recipt" : {
            
        }"""

        output_format = f"""A Json with 2 string keys ("meal_plan" and "ingredients_list").\
            (Value of "meal_plan" contains an object of 7 string key-value pairs whose \
                keys are {self.week_day_names} and each value contains a list of 5 string key-value pairs for {self.meals}.\
            The value of each meal name is planned meal.)\
            (Value of "ingredients_list" contains a list of string key-value pairs of meal name and meal ingredients.\
                for example, {ingredient_list_example})

            Please give me complete plan with the required output format and please do not add any other string like //, ..., etc in JSON. It should be a valid JSON.
        """

        # user_message = f"""Relevant information for meal planning:\n\
        #     Step 1> Check if <{self.food_genre}, {self.preferred_foods} , {self.avoid_foods}, {self.allergic_foods}> are valid food items or genre.
        #     Step 2> Get an idea of other food items that user will prefer on the basis of <{self.food_genre}, {self.preferred_foods}>.
        #     Step 3> Filter out yourself by considering that I am very much allergic to {self.allergic_foods} and I want to avoid {self.avoid_foods}.
        #     Step 4> Follow these requests ({hidden_requests}) to generate a 7 day weekly diet plan for the meals : {self.meals} \
        #         considering (food genre : {self.food_genre}, preferred foods : {self.preferred_foods}, allergic foods : {self.allergic_foods}, foods to avoid : {self.avoid_foods})>
        #     Step 5> Important: Add treats "{self.treats}" 3 times per week with dinner meals in the plan prepared in step 5.
        #     Step 6> from step 5 generated diet plan. find out the ingredients for all meals.
        #     Step 7> Return the result in the format : <{output_format}>
        # """
        user_message = f"""Relevant information for meal planning:\n\
            Step 1> My preferences are:-\
                ```a) Am I vegetarian : {self.vegan_check}\
                b) Cuisines : {self.food_genre}\
                c) Protein : {self.protein}\
                d) Fruits : {self.fruits}\
                e) Vegetables : {self.vegetables}\
                f) Starch : {self.starch}\
                g) Dairy : {self.dairy}```\
                Please understand the recipes that can be formed using these.
            Step 2> Get an idea of several food items that I would love to eat on the basis of my preferences as described in step 1.\
            Step 3> Filter out yourself by considering that I am very much allergic to {self.allergic_foods} and I want to avoid {self.avoid_foods}.\
            Step 4> Follow these requests ({hidden_requests}) to generate a 7 day weekly diet plan for the meals : {self.meals} \
                considering (my preferences as described in step 1, allergies : {self.allergic_foods}, to avoid items : {self.avoid_foods})>\
            Step 5> from step 4 generated diet plan. find out the ingredients for all meals.\
            Step 6> Return the result only in the following format : <{output_format}>
        """

        return system_message, assistant_message, user_message

    async def planner(self):
        """
            returns final_response, i.e. the response generated by gpt
        """
        system_message, assistant_message, user_message = self.get_planner_prompt()
        print("*"*25)
        print(system_message)
        print("*"*25)
        print(assistant_message)
        print("*"*25)
        print(user_message)
        print("*"*25)
        messages = self.create_message(
            system_message, assistant_message, user_message)
        final_response = await get_completion_from_messages(messages)
        print(final_response)
        self.response = final_response['context']
        self.usage = final_response['usage']

        start_index = self.response.find('{')
        end_index = self.response.rfind('}')
        self.json_data = self.response[start_index:end_index + 1]
        return self.json_data

    def dump(self):
        """
            Stores all the query specific details in a json file in history directory
        """
        directory = self.json_dump_path
        try:
            if not os.path.exists(directory):
                os.makedirs(directory)
                print(f"Directory '{directory}' created successfully.")
            else:
                print(f"Directory '{directory}' already exists.")
        except:
            print(f"An error occurred: {str(e)}")

        # current_timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        # file_name = f"{current_timestamp}.json"
        file_name = "temp.json"
        print(file_name)

        try:

            data = {'meal_requirements': self.meal_requirements, 'message': self.message,
                    'usage': self.usage, 'response': self.response, 'json_data': json.loads(self.json_data.strip())}
            # Check and replace None values with an appropriate default value
            for key, value in data.items():
                if value is None:
                    data[key] = "N/A"

            # Write the JSON file to the history directory
            with open(os.path.join(self.json_dump_path, file_name), "w") as file:
                json.dump(data, file)
        except Exception as e:
            print(f"An error occurred while writing file: {str(e)}")

    def get_leftover_takeout_prompt(self):
        assistant_msg = f'''using {self.week_day_names} and {self.meals} find out and return the required data'''

        system_msg = """Your task is to convert provided data into a relevant format after understanding input data.\
            Understand these examples to find a pattern and then provide output in this format:\
            ```1) Leftover : monday dinner; Takeout : Friday all day -> {"Leftover":{"1" : ["5"]}, "Takeout" : {"5" : ["1","2","3","4","5"]}}\
             2) Leftover : tuesday lunch, sunday dinner; Takeout : Friday breakfast, saturday all day -> {"Leftover":{"2" : ["3"], "7" : ["5"]}, "Takeout" : {"5" : ["1"], "6" : ["1","2","3","4","5"]}}\
             3) Leftover : Friday dinner, wednesday breakfast; Takeout : Friday lunch, saturday night -> {"Leftover":{"5" : ["5"], "3" : ["1"]}, "Takeout" : {"5" : ["3"], "6" : ["5"]}}\
            ```"""
        user_msg = f"""Leftover : {self.leftover_days}; Takeout : {self.takeout_days}"""

        return system_msg, assistant_msg, user_msg

    async def find_leftover_takeout(self):
        system_message, assistant_message, user_message = self.get_leftover_takeout_prompt()
        messages = self.create_message(
            system_message, assistant_message, user_message)
        final_response = await get_completion_from_messages(messages, max_tokens=250)
        context = final_response['context']
        context = context[context.find('{'):context.rfind('}') + 1]
        self.ignore_days = context
        return self.ignore_days

    def get_treats_prompt(self):
        assistant_msg = f'''Understand these examples to find a pattern and then provide output in this format:\
         1) Treats : chocolate, ice cream -> ["chocolate","ice cream","chocolate"]\
         2) Treats : ice cream, donuts, oreo -> ["ice cream","donuts","oreo"].
         Return [] empty list if no valid input is provided'''

        system_msg = """You will be provided with a list of treats. \
            Your task is to randomly choose only 3 of them and return in a python string list having 3 items.\
            Items can be repeated if there is less than 3 items."""
        user_msg = f"""{self.treats}"""

        return system_msg, assistant_msg, user_msg

    async def find_treats(self):
        system_message, assistant_message, user_message = self.get_treats_prompt()
        messages = self.create_message(
            system_message, assistant_message, user_message)
        final_response = await get_completion_from_messages(messages, max_tokens=250)
        context = final_response['context']
        context = context[context.find('['):context.rfind(']') + 1]
        self.final_treat_items = """{"final_treat_items" : """ + \
            context + """}"""
        return self.final_treat_items
