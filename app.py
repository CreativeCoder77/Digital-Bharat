import os
import json
import io
import requests
from flask import Flask, render_template, request, jsonify, Response
import geopandas as gpd
from helpers.json import add_task
from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor
import threading
import time

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec

app = Flask(__name__)

app.config['JSON_SORT_KEYS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

executor = ThreadPoolExecutor(max_workers=4)

_map_cache = {}
_cache_lock = threading.Lock()
CACHE_TTL = 3600

PROBLEM_REPORT_FILE = "data/problem_reports.json"
DONATION_FILE = "data/donations.json"
APPLICATION_FILE = "data/applications.json"
CONTACT_FILE = "data/contact.json"
DOCTOR_APPOINTMENT_FILE = "data/doctor_appointment.json"
MEDICINES_FILE = "data/medicines.json"
ACTIVITY_FILE = 'user_activity.json'


VILLAGES_DATA = [
    {"name": "Gharaunda", "status": "Model Village", "lat": 29.5236, "lon": 76.9713, "state": "Haryana"},
    {"name": "Bhadreshwar", "status": "Connected", "lat": 22.8322, "lon": 69.4281, "state": "Gujarat"},
    {"name": "Rampur", "status": "Developing", "lat": 28.8106, "lon": 79.0269, "state": "Uttar Pradesh"},
    {"name": "Singur", "status": "Connected", "lat": 22.8196, "lon": 88.2320, "state": "West Bengal"},
    {"name": "Kovilpatti", "status": "Model Village", "lat": 9.1717, "lon": 77.8691, "state": "Tamil Nadu"},
    {"name": "Bastar", "status": "Developing", "lat": 19.0748, "lon": 81.9725, "state": "Chhattisgarh"},
    {"name": "Mandya", "status": "Connected", "lat": 12.5211, "lon": 76.8958, "state": "Karnataka"},
    {"name": "Barpeta", "status": "Model Village", "lat": 26.3166, "lon": 90.9698, "state": "Assam"},
    {"name": "Shamli", "status": "Connected", "lat": 29.4497, "lon": 77.3119, "state": "Uttar Pradesh"},
    {"name": "Kargil", "status": "Developing", "lat": 34.5553, "lon": 76.1258, "state": "Ladakh"},
    {"name": "Banswara", "status": "Model Village", "lat": 23.5467, "lon": 74.4421, "state": "Rajasthan"},
    {"name": "Raichur", "status": "Developing", "lat": 16.2076, "lon": 77.3546, "state": "Karnataka"},
    {"name": "Chirala", "status": "Connected", "lat": 15.8222, "lon": 80.3522, "state": "Andhra Pradesh"},
    {"name": "Rewari", "status": "Model Village", "lat": 28.1970, "lon": 76.6176, "state": "Haryana"},
    {"name": "Tezpur", "status": "Connected", "lat": 26.6330, "lon": 92.8000, "state": "Assam"},
]

INDIA_BOUNDS = {
    "min_lon": 68.1766451354,
    "min_lat": 7.96553477623,
    "max_lon": 97.4025614766,
    "max_lat": 35.4940095078
}

API_KEY = os.environ.get('GEMINI_API_KEY') #replace with your api key 

@app.route('/get_api_key')
def get_api_key():
    return jsonify({"api_key": API_KEY})


@lru_cache(maxsize=1)
def load_static_data():
    try:
        with open(os.path.join(app.root_path, 'static', 'data.json'), 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print("Warning loading data.json:", e)
        return {}

def get_cached_geodata():
    with _cache_lock:
        current_time = time.time()
        if 'geodata' in _map_cache and current_time - _map_cache['timestamp'] < CACHE_TTL:
            return _map_cache['geodata']
    
    executor.submit(_fetch_geodata_background)
    return _map_cache.get('geodata')

def _fetch_geodata_background():
    try:
        api_url = "https://www.geoboundaries.org/api/current/gbOpen/IND/ADM1/"
        resp_api = requests.get(api_url, timeout=5)
        resp_api.raise_for_status()
        
        geojson_url = resp_api.json().get("gjDownloadURL")
        if geojson_url:
            resp_geo = requests.get(geojson_url, timeout=10)
            resp_geo.raise_for_status()
            
            with _cache_lock:
                _map_cache['geodata'] = resp_geo.text
                _map_cache['timestamp'] = time.time()
                
    except Exception as e:
        print(f"Background geodata fetch failed: {e}")

@app.route('/')
def index():
    data = load_static_data()
    return render_template('index.html', data=data)

@app.route('/generate_map')
def generate_map():
    try:
        cached_geodata = get_cached_geodata()
        
        if cached_geodata:
            india_states = gpd.read_file(io.StringIO(cached_geodata))
        else:
            return _generate_simple_map()

        return _generate_optimized_map(india_states)
        
    except Exception as e:
        print("Map generation error:", e)
        return _generate_simple_map()

def _generate_simple_map():
    import matplotlib.pyplot as plt
    
    fig, ax = plt.subplots(figsize=(10, 8))
    
    colors = {
        "Model Village": "#00B383",
        "Connected": "#2563EB", 
        "Developing": "#FF6B00"
    }
    
    for village in VILLAGES_DATA:
        color = colors.get(village['status'], '#888888')
        ax.scatter(village['lon'], village['lat'], c=color, s=100, alpha=0.8)
        ax.text(village['lon'], village['lat'] + 0.2, village['name'], 
                fontsize=8, ha='center', va='bottom', color='#E0E0E0',
                bbox=dict(boxstyle="round,pad=0.2", fc="#1A1A1A", ec="#E0E0E0", lw=0.5))
    
    ax.set_xlim(68, 98)
    ax.set_ylim(8, 36)
    ax.set_title('Village Impact Across India (Simplified)', fontsize=16, color='#E0E0E0')
    ax.set_facecolor('#1A1A1A')
    ax.set_axis_off()
    fig.patch.set_facecolor('#1A1A1A')
    
    handles = [plt.scatter([], [], c=color, s=100, label=status) 
               for status, color in colors.items()]
    ax.legend(handles=handles, facecolor='#1A1A1A', edgecolor='#E0E0E0', labelcolor='#E0E0E0')
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=80)
    buf.seek(0)
    plt.close(fig)
    
    return Response(buf.getvalue(), mimetype='image/png')

def _generate_optimized_map(india_states):
    import random
    from flask import Response
    
    jittered_data = []
    existing_coords = set()
    for v in VILLAGES_DATA:
        lat, lon = v["lat"], v["lon"]
        key = f"{round(lat, 3)}_{round(lon, 3)}"
        if key in existing_coords:
            lat += random.uniform(-0.05, 0.05)
            lon += random.uniform(-0.05, 0.05)
        existing_coords.add(key)
        jittered_data.append({**v, "lat": lat, "lon": lon})

    gdf = gpd.GeoDataFrame(
        jittered_data,
        geometry=gpd.points_from_xy([v["lon"] for v in jittered_data],
                                    [v["lat"] for v in jittered_data]),
        crs="EPSG:4326"
    )

    fig = plt.figure(figsize=(13, 8))
    gs = gridspec.GridSpec(1, 2, width_ratios=[0.6, 3.4])
    info_ax = fig.add_subplot(gs[0])
    map_ax = fig.add_subplot(gs[1])

    info_ax.set_facecolor('#1A1A1A')
    info_ax.set_xlim(0, 1)
    info_ax.set_ylim(0, len(gdf) + 2)
    info_ax.axis('off')
    info_ax.text(0.05, len(gdf) + 0.8, "Village Info", fontsize=12, color="#00FFB3", weight='bold')

    for idx, row in enumerate(gdf.itertuples()):
        info_ax.text(
            0.05,
            len(gdf) - idx + 0.3,
            f"{row.name}: ({row.lat:.2f}, {row.lon:.2f})",
            fontsize=9,
            color="#E0E0E0",
            verticalalignment='center'
        )

    india_states.plot(ax=map_ax, color='#2A2A2A', edgecolor='#555555', linewidth=0.5)

    colors = {"Model Village": "#00B383", "Connected": "#2563EB", "Developing": "#FF6B00"}
    
    for status, col in colors.items():
        subset = gdf[gdf['status'] == status]
        if not subset.empty:
            subset.plot(ax=map_ax, marker='o', color=col, markersize=50, label=status)

    label_positions = []

    def is_far_enough(x, y, threshold=0.3):
        for lx, ly in label_positions:
            if abs(x - lx) < threshold and abs(y - ly) < threshold:
                return False
        return True

    for idx, row in gdf.iterrows():
        x, y = row.geometry.x, row.geometry.y
        label = row.get("name", "")
        offset_y = 0.2
        attempts = 0
        while not is_far_enough(x, y + offset_y) and attempts < 5:
            offset_y += 0.2
            attempts += 1

        map_ax.text(
            x,
            y + offset_y,
            label,
            fontsize=8,
            color='#E0E0E0',
            ha='center',
            va='bottom',
            bbox=dict(boxstyle="round,pad=0.2", fc="#1A1A1A", ec="#E0E0E0", lw=0.5)
        )
        label_positions.append((x, y + offset_y))

    map_ax.set_title('Village Impact Across India', color='#E0E0E0', fontsize=16)
    map_ax.set_axis_off()
    fig.patch.set_facecolor('#1A1A1A')
    map_ax.set_facecolor('#1A1A1A')
    map_ax.legend(facecolor='#1A1A1A', edgecolor='#E0E0E0', labelcolor='#E0E0E0')

    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.3, dpi=100)
    buf.seek(0)
    plt.close(fig)
    
    return Response(buf.getvalue(), mimetype='image/png')

@app.route('/get_map_data')
def get_map_data():
    return jsonify({
        "map_bounds": INDIA_BOUNDS,
        "villages": VILLAGES_DATA
    }), 200

@app.route('/submit_contact_form', methods=['POST'])
def submit_contact_form():
    try:
        data = request.get_json()
        executor.submit(add_task, CONTACT_FILE, data, "", True, "Contacts", True)
        return jsonify({"status": "success", "message": "Thank you for your message! We will get back to you soon."}), 200
    except Exception as e:
        print("Error submitting contact form:", e)
        return jsonify({"status": "error", "message": "Failed to send message."}), 500

@app.route('/submit_problem_report', methods=['POST'])
def submit_problem_report():
    try:
        data = request.get_json()
        executor.submit(add_task, PROBLEM_REPORT_FILE, data, "pending", True, "Problems", True)
        return jsonify({"status": "success", "message": "Your problem report has been successfully submitted! We will review it and get back to you."}), 200
    except Exception as e:
        print("Error submitting problem report:", e)
        return jsonify({"status": "error", "message": "An error occurred while submitting your report. Please try again later."}), 500

@app.route('/submit_donation', methods=['POST'])
def submit_donation():
    try:
        data = request.get_json()
        executor.submit(add_task, DONATION_FILE, data, None, True, "Donations Made", True, True, False)
        return jsonify({"status": "success", "message": f"Thank you for your interest in donating to \"{data.get('optionName', 'our initiative')}\"! We'll reach out with more details."}), 200
    except Exception as e:
        print("Error submitting donation:", e)
        return jsonify({"status": "error", "message": "Failed to process donation."}), 500

@app.route('/doctor_appointment', methods=['POST'])
def doctor_appointment():
    try:
        data = request.get_json()
        executor.submit(add_task, DOCTOR_APPOINTMENT_FILE, data, None, True, "Doctor Appointment", True, True, False)
        return jsonify({"status": "success", "message": "Your appointment request has been submitted successfully!"}), 200
    except Exception as e:
        print("Error submitting appointment:", e)
        return jsonify({"status": "error", "message": "Failed to process appointment."}), 500

@app.route('/medicines', methods=['POST'])
def medicines():
    try:
        data = request.get_json()
        executor.submit(add_task, MEDICINES_FILE, data, None, True, "Medicines", True, None, False)
        return jsonify({"status": "success", "message": "Your medicine request has been submitted successfully!"}), 200
    except Exception as e:
        print("Error submitting medicine request:", e)
        return jsonify({"status": "error", "message": "Failed to book medicines."}), 500

@app.route('/submit_application', methods=['POST'])
def submit_application():
    try:
        data = request.get_json()
        executor.submit(add_task, APPLICATION_FILE, data, "pending", True, "Applications", True)
        return jsonify({"status": "success", "message": f"Thank you for applying for the \"{data.get('roleTitle', 'a role')}\" role! We'll review your application and get back to you."}), 200
    except Exception as e:
        print("Error submitting application:", e)
        return jsonify({"status": "error", "message": "Failed to submit application."}), 500

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": time.time()}), 200

import datetime


CLICK_FILE = "click_data.json"
USER_FILE = "user_activity.json"

def load_json(file_path):
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump({"users": []}, f)
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            if not isinstance(data, dict):
                raise ValueError
            return data
    except (json.JSONDecodeError, ValueError):
        return {"users": []}

def save_json(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

def get_client_ip():
    return request.headers.get('X-Forwarded-For', request.remote_addr)

# ---------- Click Tracking ----------
@app.route("/tab-click", methods=["POST"])
def tab_click():
    tab_id = request.json.get("tab_id")
    if not tab_id:
        return jsonify({"error": "No tab_id provided"}), 400

    data = load_json(CLICK_FILE)
    if not data:
        data = {}
    data[tab_id] = data.get(tab_id, 0) + 1
    save_json(CLICK_FILE, data)

    # Track user
    track_user()

    return jsonify({"message": "Click recorded", "count": data[tab_id]})

@app.route("/tab-clicks", methods=["GET"])
def get_tab_clicks():
    return jsonify(load_json(CLICK_FILE))

# ---------- User Tracking ----------
def track_user():
    ip = get_client_ip()
    now = datetime.datetime.utcnow().isoformat()

    try:
        data = load_json(USER_FILE)
    except json.JSONDecodeError:
        data = {"users": []}

    if "users" not in data:
        data["users"] = []

    found = False
    for user in data["users"]:
        if user["ip"] == ip:
            user["last_seen"] = now
            found = True
            break

    if not found:
        data["users"].append({"ip": ip, "last_seen": now})

    save_json(USER_FILE, data)

# FIX 1: Changed route from /active-users to /user-stats to match frontend
@app.route("/user-stats", methods=["GET"])
def user_stats():
    data = load_json(USER_FILE)
    now = datetime.datetime.utcnow()
    active_count = 0
    all_time = len(data.get("users", []))

    for user in data.get("users", []):
        try:
            last_seen = datetime.datetime.fromisoformat(user["last_seen"])
            if (now - last_seen) <= datetime.timedelta(hours=24):
                active_count += 1
        except (ValueError, KeyError):
            # Skip users with invalid timestamp data
            continue

    print(f"[DEBUG] Active: {active_count}, Total: {all_time}")
    
    # FIX 2: Changed response keys to match what frontend expects
    return jsonify({
        "active_users_last_24h": active_count,
        "total_unique_users": all_time
    })

AI_USAGE_FILE = "ai_usage_stats.json"

@app.route("/ai-usage-track", methods=["POST"])
def track_ai_usage():
    ai_type = request.json.get("ai_type")
    if not ai_type:
        return jsonify({"error": "No ai_type provided"}), 400

    data = load_json(AI_USAGE_FILE)
    if not data:
        data = {}
    
    data[ai_type] = data.get(ai_type, 0) + 1
    save_json(AI_USAGE_FILE, data)
    
    # Also track user
    track_user()
    
    return jsonify({"message": "AI usage tracked", "count": data[ai_type]})

@app.route("/ai-usage-stats", methods=["GET"])
def get_ai_usage_stats():
    return jsonify(load_json(AI_USAGE_FILE))

if __name__ == '__main__':
    executor.submit(_fetch_geodata_background)
    app.run(debug=True, threaded=True, host='0.0.0.0', port=5000)