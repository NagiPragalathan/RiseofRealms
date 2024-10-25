from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

api_key = "gdmg6kqp"

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
    return response.json()

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    conversation_data = generate_conversation(user_input)
    
    response = conversation_data.get("dialogue", "I'm not sure how to respond to that. Can you ask me something else?")
    
    try:
        res = json.loads(response)
        print(res)
        return jsonify(res)  
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse the response"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
