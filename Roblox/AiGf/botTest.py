import requests
import json

# Step 1: Prepare the conversation topic and response generation
prompt = '''
    You are a virtual girlfriend.
    You will always reply with a JSON array of messages. With a maximum of 3 messages.
    Each message has a text, facialExpression, and animation property.
    The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
    The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry.
    Note: just give the json content, don't give any unwanted content or char. I don't need .md content. Avoid ```json and ```
'''

# API key (you've already got it)
api_key = "gdmg6kqp"

# Step 2: Generate conversation based on user input
def generate_conversation(user_input):
    url = "https://authdev.xgaming.club/xquest/generate"
    
    json_data = {
        "goal": "Respond naturally to the user's question",
        "key": api_key,
        "fields": ["conversation_topic"],
        "n": 1,
        "story": f"User says: {user_input}"
    }

    response = requests.post(url, json=json_data)
    
    # Return the JSON response
    return response.json()

# Step 3: Chatbot conversation loop
def chatbot():
    print("Chatbot: Hello! Let's have a chat. Ask me anything!")
    
    while True:
        user_input = input("You: ")
        
        # Exit if the user says "bye"
        if "bye" in user_input.lower():
            print("Chatbot: Goodbye! It was great chatting with you!")
            break
        
        # Generate conversation response from API
        conversation_data = generate_conversation(user_input)
        
        # Extract the dialogue (JSON response from API)
        response = conversation_data.get("dialogue", "I'm not sure how to respond to that. Can you ask me something else?")
        
        try:
            # Parse the response as JSON
            res = json.loads(response)
            for message in res:
                print(f"Chatbot: {message['text']}")
                print(f"Facial Expression: {message['facialExpression']}, Animation: {message['animation']}")
        except json.JSONDecodeError:
            print("Chatbot: Something went wrong. Please try again.")

if __name__ == "__main__":
    chatbot()
