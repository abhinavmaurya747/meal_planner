import openai
import asyncio


async def get_completion_from_messages(messages,
                                    model="gpt-3.5-turbo",
                                    #    model="gpt-4",
                                    temperature=1,
                                    max_tokens=3000):
    await asyncio.sleep(1)
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return {"context": response.choices[0].message["content"], "usage": response.usage}


def create_message(system_message, assistant_message, user_message):
    """
        Used to create the prompt to get the recommendation list from GPT.
    """
    messages = [
        {'role': 'system',
            'content': system_message},
        {'role': 'assistant',
            'content': assistant_message},
        {'role': 'user',
            'content': f"""{user_message}"""},
    ]
    return messages
