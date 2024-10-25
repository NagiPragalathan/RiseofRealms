import requests
import random

# Step 1: Prepare the API for conversation topics and responses
def init_api():
    url = "https://authdev.xgaming.club/xquest/init"
    
    json_data = {
        "fields": {
            "conversation_topic": {
                "desc": "You are a chatbot to answer questions and help to the user. consider you are the Ai chatbot",
                "data": [
                    {"General": "Talk about general topics like how you are doing, daily activities, etc. Note: just give the Ai response only dont give it like Ai and user conversation"}
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
    
    api_key = "8cileoer"
    
    while True:
        user_input = input("You: ")
        
        if "bye" in user_input.lower():
            print("Chatbot: Goodbye! It was great chatting with you!")
            break
        
        conversation_data = generate_conversation(api_key, user_input)
        print(conversation_data)
        
        response = conversation_data.get("suggestion", "I'm not sure how to respond to that. Can you ask me something else?")
        
        print(f"Chatbot: {response}")

if __name__ == "__main__":
    chatbot()
