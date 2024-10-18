import requests

# The base URL of your server
BASE_URL = "http://localhost:3001"

# The player_id to test
player_id = "admin"  # Replace with the actual player ID you want to test

# API endpoint to get the avatar model URL
url = f"{BASE_URL}/api/get-avatar/{player_id}"

try:
    # Send GET request to the API
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        print(f"Model URL for player_id '{player_id}': {data['model_url']}")
    elif response.status_code == 404:
        print(f"No model found for player_id '{player_id}'.")
    else:
        print(f"Failed to retrieve model URL. Status code: {response.status_code}")
        print(f"Response: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Error during the request: {e}")
