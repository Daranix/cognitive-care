import argparse
import os
from faster_whisper import WhisperModel
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_db_connection():
    """Create and return a database connection using DATABASE_URL"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL not found in environment variables")
    
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def get_appointment_audio(appointment_id):
    """Fetch the audio file path from the database for given appointment"""
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT audio_file
            FROM appointments
            WHERE id = %s
        """, (appointment_id,))
        
        result = cur.fetchone()
        
        if not result:
            raise ValueError(f"No appointment found with ID: {appointment_id}")
            
        return result['audio_file']
        
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")
        
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def transcribe_audio(audio_path):
    """Transcribe the audio file using Whisper model"""
    model_size = "large-v3"
    
    # Run on GPU with FP16
    model = WhisperModel(model_size, device="cuda", compute_type="float16")
    
    # Ensure the audio file exists
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found at: {audio_path}")
    
    segments, info = model.transcribe(audio_path, beam_size=5)
    
    return segments, info

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Transcribe audio from appointment')
    parser.add_argument('--appointment-id', type=str, required=True,
                      help='The ID of the appointment to transcribe')
    
    args = parser.parse_args()
    
    try:
        # Get audio file path from database
        audio_file = get_appointment_audio(args.appointment_id)
        
        # Construct full path to audio file
        base_path = os.getenv('STORE_AUDIOS_BASE_PATH')  # Update this to your actual base path
        full_audio_path = os.path.join(base_path, audio_file)
        
        # Transcribe the audio
        segments, info = transcribe_audio(full_audio_path)
        
        # Print results
        print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
        
        #segments = list(segments)
        #print(segments)

        for segment in segments:
            print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
            
    except Exception as e:
        print(f"Error: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()