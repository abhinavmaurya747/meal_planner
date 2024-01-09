from openai_utils import get_completion_from_messages

class RecipeFinder:
    def __init__(self, meal_name):
        self.meal_name = meal_name
        self.recipe = None
        self.ingredients = None
        
    def create_message(self, system_message, assistant_message, user_message):
        """
            Used to create the prompt to get the recipe and ingredients from GPT.
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
    
    def get_recipe_prompt(self):
        assistant_msg = f'''I will provide recipe in steps:
        Step 1> Do this
        Step 2> Do this
        ...
        Step N> DO this
        '''

        system_msg = """You will be provided with a meal name. \
            Your task is to recommend its recipe in a very concise manner step by step"""
        user_msg = f"""{self.meal_name}"""

        return system_msg, assistant_msg, user_msg

    async def find_recipe(self):
        system_message, assistant_message, user_message = self.get_recipe_prompt()
        messages = self.create_message(
            system_message, assistant_message, user_message)
        final_response = await get_completion_from_messages(messages, max_tokens=1000)
        context = final_response['context']
        self.recipe = {"suggestedRecipe" : context}
        return self.recipe

    def get_ingredients_prompt(self):
        assistant_msg = f'''I will provide recipe in steps:
        Step 1> Do this
        Step 2> Do this
        ...
        Step N> DO this
        '''

        system_msg = """You will be provided with a meal name. \
            Your task is to provide its ingredients in a very concise manner\
            for the ingredient list, separate by section at the grocery store (produce vs meat vs freezer section…)
            (Grocery section name)> Ingredient 1, ingredient 2, etc.
            ...
            (Grocery section name)> Ingredient 1, ingredient 2, etc.
            """
        user_msg = f"""{self.meal_name}"""

        return system_msg, assistant_msg, user_msg

    async def find_ingredients(self):
        system_message, assistant_message, user_message = self.get_ingredients_prompt()
        messages = self.create_message(
            system_message, assistant_message, user_message)
        final_response = await get_completion_from_messages(messages, max_tokens=1000)
        context = final_response['context']
        self.ingredients = {"ingredients" : context}
        return self.ingredients
