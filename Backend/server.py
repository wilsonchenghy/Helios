from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import time
from langchain_openai import ChatOpenAI
import requests

app = Flask(__name__)
CORS(app)

# Create static folders if they don't exist
STATIC_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
VIDEO_FOLDER = os.path.join(STATIC_FOLDER, 'videos')
os.makedirs(VIDEO_FOLDER, exist_ok=True)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
PEXELS_API_KEY = os.getenv('VITE_PEXELS_API_KEY')
JAMENDO_CLIENT_ID = os.getenv('VITE_JAMENDO_CLIENT_ID')

def generate_video_from_image(image_path, duration):
    try:
        # Generate a unique filename based on timestamp
        timestamp = int(time.time())
        output_filename = f'image_video_{timestamp}.mp4'
        output_path = os.path.join(VIDEO_FOLDER, output_filename)
        
        subprocess.run([
            'ffmpeg', '-loop', '1', '-i', image_path,
            '-c:v', 'libx264', '-preset', 'ultrafast', '-t', str(duration), output_path
        ])
        return output_filename
    except Exception as e:
        print('Error generating video:', e)
        return None

@app.route('/generate_video', methods=['POST'])
def handle_generate_video():
    data = request.get_json()
    image_path = data.get('imagePath')
    duration = data.get('duration')
    if not image_path or not duration:
        return 'Missing imagePath or duration', 400

    video_filename = generate_video_from_image(image_path, duration)
    if video_filename:
        return f'static/videos/{video_filename}'
    else:
        return 'Failed to generate video', 500

@app.route('/static/videos/<filename>', methods=['GET'])
def serve_video(filename):
    return send_from_directory(VIDEO_FOLDER, filename)
    
@app.route('/AI_Command_Box', methods=['POST'])
def generate_response():
    data = request.json
    prompt = data.get('prompt', '')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    try:
        print("hey")
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
            api_key=OPENAI_API_KEY,
        )

        messages = [
            (
                "system",
                " ",
            ),
            ("human", prompt),
        ]

        ai_msg = llm.invoke(messages)

        return jsonify(ai_msg.content), 200
    
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    
@app.route('/proxy/pexels/images', methods=['GET'])
def proxy_pexels_images():
    query = request.args.get('query')
    per_page = request.args.get('per_page', 10)
    
    try:
        response = requests.get(
            f"https://api.pexels.com/v1/search?query={query}&per_page={per_page}",
            headers={"Authorization": PEXELS_API_KEY}
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/proxy/pexels/videos', methods=['GET'])
def proxy_pexels_videos():
    query = request.args.get('query')
    per_page = request.args.get('per_page', 10)
    
    try:
        response = requests.get(
            f"https://api.pexels.com/videos/search?query={query}&per_page={per_page}",
            headers={"Authorization": PEXELS_API_KEY}
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/proxy/jamendo/tracks', methods=['GET'])
def proxy_jamendo_tracks():
    namesearch = request.args.get('namesearch', '')
    limit = request.args.get('limit', 10)
    
    try:
        response = requests.get(
            f"https://api.jamendo.com/v3.0/tracks/?client_id={JAMENDO_CLIENT_ID}&format=jsonpretty&limit={limit}&namesearch={namesearch}"
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)