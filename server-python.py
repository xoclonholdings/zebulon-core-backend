#!/usr/bin/env python3
import json
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs
from datetime import datetime
import sys

class ZEDHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.end_headers()
            response = {
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'server': 'ZED Python Fallback Server'
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except:
            data = {}

        if self.path == '/api/login':
            username = data.get('username', '')
            password = data.get('password', '')
            
            print(f"Login attempt: {username}")
            
            if username == 'Admin' and password == 'Zed2025':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Credentials', 'true')
                self.send_header('Set-Cookie', 'zed_session=authenticated; Path=/; HttpOnly')
                self.end_headers()
                response = {'success': True, 'message': 'Login successful'}
                print("✅ Login successful")
            else:
                self.send_response(401)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Credentials', 'true')
                self.end_headers()
                response = {'success': False, 'reason': 'Invalid credentials'}
                print("❌ Invalid credentials")
            
            self.wfile.write(json.dumps(response).encode())

        elif self.path == '/api/ask':
            message = data.get('message', '')
            print(f"Chat message: {message}")
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.end_headers()
            
            response = {
                'message': f'ZED: Hello! You said "{message}". The Python server is working!',
                'timestamp': datetime.now().isoformat(),
                'source': 'ZED_PYTHON'
            }
            self.wfile.write(json.dumps(response).encode())
        
        else:
            self.send_response(404)
            self.end_headers()

PORT = 5000
print(f"🚀 Starting ZED Python Fallback Server on port {PORT}...")
print("📝 Login credentials: Admin / Zed2025")
print("🔒 Authentication endpoint: POST /api/login")
print("💬 Chat endpoint: POST /api/ask")
print("📊 Health check: GET /api/health")

try:
    with socketserver.TCPServer(("", PORT), ZEDHandler) as httpd:
        print(f"📡 Server running at http://localhost:{PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 Server stopped")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
