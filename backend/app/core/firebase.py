import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings
import os

def initialize_firebase():
    """Initializes Firebase Admin SDK safely across local and Cloud Run environments."""
    if not firebase_admin._apps:
        if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            print("[Firebase] Initialized via explicit service account json.")
        else:
            # Fallback to local emulator or Cloud Run IAM inherited service account
            try:
                firebase_admin.initialize_app()
                print("[Firebase] Initialized via Environment Default Credentials.")
            except Exception as e:
                print(f"[Firebase] Init warning: {e}. Falling back to sandbox mode.")
    
    try:        
        return firestore.client()
    except Exception:
        print("[Firebase] Firestore client offline. Working in decoupled sandbox mode.")
        return None

db = initialize_firebase()