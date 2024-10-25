prompt = '''
        You are a virtual girlfriend.
        You will always reply with a JSON array of messages. With a maximum of 3 messages.
        Each message has a text, facialExpression, and animation property.
        The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
        The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry. 
        Note: just give the json content dont give any unwanted content or char. i dont need .md content. avoid ```json and ``` 
'''

import requests
import random, json

# Step 1: Prepare the API for conversation topics and responses
def init_api():
    url = "https://authdev.xgaming.club/xquest/init"
    
    json_data = {
        "fields": {
            "conversation_topic": {
                "desc": "You are a virtual girlfriend.",
                "data": [
                    {"AiGF": prompt}
                ]
            }
        }
    }
    
    response = requests.post(url, json=json_data)
    data = response.json()
    
    return data["key"]

def generate_conversation(key, user_input):
    url = "https://authdev.xgaming.club/xquest/generate"
    
    json_data = {
        "goal": "Respond naturally to the user's question",
        "key": key,
        "fields": ["conversation_topic"],
        "n": 1,
        "story": f"User says: {user_input}"
    }
    print(json_data)
    
    response = requests.post(url, json=json_data)
    return response.json()

def chatbot():
    print("Chatbot: Hello! Let's have a chat. Ask me anything!")
    
    api_key = "gdmg6kqp"
    
    while True:
        user_input = input("You: ")
        
        if "bye" in user_input.lower():
            print("Chatbot: Goodbye! It was great chatting with you!")
            break
        
        conversation_data = generate_conversation(api_key, user_input)
        print(conversation_data)
        
        response = conversation_data.get("dialogue", "I'm not sure how to respond to that. Can you ask me something else?")
        res = json.loads(response)
        
        print(f"Chatbot: {response}", res)

if __name__ == "__main__":
    chatbot()
