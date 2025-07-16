from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import re
from functools import wraps
import os

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///../instance/workout_app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
CORS(app) 

# --- MODEL DEFINITIONS ---
# Models are defined first, with dependencies in order.

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

class Workout(db.Model):
    __tablename__ = 'workouts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    area = db.Column(db.String(100))
    type = db.Column(db.String(100))
    equipment = db.Column(db.String(100))
    difficulty = db.Column(db.String(50))
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'area': self.area,
            'type': self.type,
            'equipment': self.equipment,
            'difficulty': self.difficulty,
            'description': self.description
        }

class WorkoutLog(db.Model):
    __tablename__ = 'workout_log'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    weight = db.Column(db.Float)
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('logs', lazy=True))
    workout = db.relationship('Workout', backref=db.backref('logs', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'sets': self.sets,
            'reps': self.reps,
            'weight': self.weight,
            'user_id': self.user_id,
            'workout_id': self.workout_id
        }
    
# --- JWT & VALIDATION HELPERS ---

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA'],
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user or not current_user.is_active:
                return jsonify({'message': 'Invalid token or user deactivated'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    return True, "Password is valid"

# --- API ROUTES ---

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

# Note: The GET /api/workouts route is needed for the "Log Workout" page dropdown.
@app.route('/api/workouts', methods=['GET'])
def get_workouts():
    try:
        workouts = Workout.query.all()
        return jsonify([w.to_dict() for w in workouts])
    except Exception as e:
        return jsonify({'error': 'Could not fetch workouts'}), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    if User.query.filter_by(email=data['email'].strip().lower()).first():
        return jsonify({'error': 'Email already registered'}), 409
        
    user = User(email=data['email'].strip().lower())
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    token = generate_token(user.id)
    return jsonify({'message': 'User created', 'token': token, 'user': user.to_dict()}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = User.query.filter_by(email=data['email'].strip().lower()).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    token = generate_token(user.id)
    return jsonify({'message': 'Login successful', 'token': token, 'user': user.to_dict()})

@app.route('/api/auth/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({'user': current_user.to_dict()})

@app.route('/api/logs', methods=['POST'])
@token_required
def log_workout(current_user):
    data = request.get_json()
    if not data or 'workout_id' not in data:
        return jsonify({'error': 'Missing data'}), 400

    new_log = WorkoutLog(
        user_id=current_user.id,
        workout_id=data['workout_id'],
        sets=data.get('sets'),
        reps=data.get('reps'),
        weight=data.get('weight')
    )
    
    db.session.add(new_log)
    db.session.commit()
    return jsonify({'message': 'Workout logged successfully!', 'log': new_log.to_dict()}), 201

@app.route('/api/logs', methods=['GET'])
@token_required
def get_logs(current_user):
    """Fetches all logs for the current user"""
    try:
        # Query logs and order by most recent date first
        logs = WorkoutLog.query.filter_by(user_id=current_user.id).order_by(WorkoutLog.date.desc()).all()
        
        # Create a list of log dictionaries that includes the workout name
        results = [
            {
                'id': log.id,
                'date': log.date.strftime('%Y-%m-%d'), # Format date for readability
                'workout_name': log.workout.name,  # Get name from the related Workout object
                'sets': log.sets,
                'reps': log.reps,
                'weight': log.weight
            } for log in logs
        ]
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': 'Failed to fetch logs'}), 500
    
# --- APP INITIALIZATION ---

def init_db():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5001)