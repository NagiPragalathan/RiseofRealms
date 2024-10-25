import requests
import json

def test_chatbot(message):
    url = "http://127.0.0.1:5000/chat"
    
    payload = {
        "message": message
    }
    
    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, data=json.dumps(payload), headers=headers)
    
    if response.status_code == 200:
        print("Chatbot response:")
        print(json.dumps(response.json(), indent=4))
    else:
        print(f"Error: Received status code {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_chatbot("Hello, how are you?")
