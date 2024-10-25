import requests
import random

# Step 1: Prepare the API for conversation topics and responses
def init_api():
    url = "https://authdev.xgaming.club/xquest/init"
    
    json_data = {
        "fields": {
            "conversation_topic": {
                "desc": "Choose a topic for the conversation:",
                "data": [
                    {"General": "Talk about general topics like how you are doing, daily activities, etc."},
                    {"Hobbies": "Discuss hobbies like reading, sports, or gaming."},
                    {"Personal": "Ask about personal opinions or experiences."}
                ]
            }
        }
    }
    
    response = requests.post(url, json=json_data)
    data = response.json()
    
    # Return the key received from the init request
    return data["key"]

# Step 2: Generate a response using the Quest Generation API
def generate_conversation(key, user_input):
    url = "https://authdev.xgaming.club/xquest/generate"
    
    json_data = {
        "goal": "Respond naturally to the user's question",
        "key": key,
        "fields": ["conversation_topic"],
        "n": 1,
        "story": f"User says: {user_input}"
    }
    
    response = requests.post(url, json=json_data)
    return response.json()

# Step 3: A chatbot interface for continuous conversation
def chatbot():
    print("Chatbot: Hello! Let's have a chat. Ask me anything!")
    
    # Initialize API and get the key
    api_key = init_api()
    
    while True:
        # Get user input
        user_input = input("You: ")
        
        # If the user says 'bye', end the conversation
        if "bye" in user_input.lower():
            print("Chatbot: Goodbye! It was great chatting with you!")
            break
        
        # Generate the conversation response using the API
        conversation_data = generate_conversation(api_key, user_input)
        
        # Extract the suggestion from the response
        response = conversation_data.get("suggestion", "I'm not sure how to respond to that. Can you ask me something else?")
        
        # Display the chatbot response
        print(f"Chatbot: {response}")

# Run the chatbot
if __name__ == "__main__":
    chatbot()
