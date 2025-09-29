# How to Run This App on World App 

## Prerequisites
Make sure you have the World App installed on your device.

## Setup Instructions

### 1. Create Developer Account
1. Go to https://developer.worldcoin.org/
2. Create an account
3. Set up a link to your miniapp in the developer portal

### 2. Expose Local Server
1. Install ngrok if you haven't already
2. Run your app locally
3. Use ngrok to expose your local port:
    ```bash
    ngrok http [your-port-number]
    ```
4. Copy the ngrok URL and configure it in your developer portal setup

### 3. Open in World App
1. Open the World App on your device
2. Navigate to your miniapp using the configured link
3. Your app should now be accessible through World App

## Notes
- Ensure your local server is running before testing
- The ngrok URL will change each time you restart ngrok (unless using a paid plan)
