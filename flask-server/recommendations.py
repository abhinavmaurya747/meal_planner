from openai_utils import get_completion_from_messages, create_message
from datetime import datetime
import json
import os
import random

class GenreRecommendations:
    def __init__(self, genres):
        self.genres = ", ".join(genres)
        self.recommendations = None

    def get_genre_prompt(self):
        assistant_msg = f'''Only provide results in the following format:\
            ["genre1","genre2","genre3","genre4","genre5","genre6","genre7","genre8","genre9","genre10"]'''

        system_msg = """You are a food expert and helps people in remembering their food genres. \
            Your task is to suggest related food genres including the provided genres."""
        user_msg = f"""{self.genres}"""

        return system_msg, assistant_msg, user_msg

    async def get_more_genres(self):
        system_message, assistant_message, user_message = self.get_genre_prompt()
        messages = create_message(
            system_message, assistant_message, user_message)
        final_response = await get_completion_from_messages(messages, max_tokens=250)
        context = final_response['context']
        print(context)
        context = context[context.find('['):context.rfind(']') + 1]
        self.recommendations = """{"genres" : """ + \
            context + """}"""
        return self.recommendations

class MealRecommendations:
    def __init__(self, meals):
        self.meals = ", ".join(meals)
        self.recommendations = None

    def get_meals_prompt(self):
        assistant_msg = f'''Only provide results in the following format:\
            ["meal1", "meal2", "meal3", "meal4", "meal5", "meal6", "meal7", "meal8", "meal9", "meal10"]'''

        system_msg = """You are a food expert and helps people in remembering what meals they eat. \
            Your task is to suggest related meals excluding the provided meals."""
        user_msg = f"""{self.meals}"""

        return system_msg, assistant_msg, user_msg

    async def get_more_meals(self):
        system_message, assistant_message, user_message = self.get_meals_prompt()
        messages = create_message(
            system_message, assistant_message, user_message)
        final_response = await get_completion_from_messages(messages, max_tokens=250)
        context = final_response['context']
        print(context)
        context = context[context.find('['):context.rfind(']') + 1]
        self.recommendations = """{"genres" : """ + \
            context + """}"""
        return self.recommendations
