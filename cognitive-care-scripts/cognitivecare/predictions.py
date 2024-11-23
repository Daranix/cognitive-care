import scispacy
from mental_health_predictor import MentalHealthPredictor
from dataclasses import dataclass
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os
import argparse
from datetime import datetime
from symptoms_detection import detect_symptoms
import json
import sys
import warnings

# Load environment variables from .env file
load_dotenv()

if os.getenv('SHOW_WARNINGS') == 'no':
    warnings.filterwarnings("ignore")

@dataclass
class Patient:
    patient_id: str
    age: int
    cognitive_scores: list[int]
    symptombs: set[str]
    def __getitem__(self, key):
        # Access attributes dynamically using __dict__
        if key in self.__dict__:
            return self.__dict__[key]
        else:
            raise KeyError(f"'{key}' is not a valid attribute.")

def get_db_connection():
    """Create and return a database connection using DATABASE_URL"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL not found in environment variables")
    
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def get_patient(patient_id: str) -> Patient:
    """Fetch the audio file path from the database for given appointment"""
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT *
            FROM patients
            WHERE id = %s
        """, (patient_id,))
        
        result = cur.fetchone()
        
        if not result:
            raise ValueError(f"No patient found with ID: {patient_id}")
        
        patient = Patient(
            age=calculate_age(result['date_of_birth']),
            cognitive_scores=get_cognitive_scores(patient_id),
            patient_id=result['id'],
            symptombs=detect_symptoms(result['symptoms'])
        )

        return patient
        
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")
        
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def calculate_age(date_of_birth: datetime):
    # Get the current date
    current_date = datetime.now()
    
    # Calculate the age
    age = current_date.year - date_of_birth.year
    
    # Adjust if the birthday hasn't occurred yet this year
    if (current_date.month, current_date.day) < (date_of_birth.month, date_of_birth.day):
        age -= 1
    
    return age

def get_cognitive_scores(patient_id: str) -> dict[str, int]:
    query = """
        WITH RankedScores AS (
            SELECT 
                *,
                ROW_NUMBER() OVER (
                    PARTITION BY tool_used
                    ORDER BY assessment_date DESC, created_at DESC
                ) AS rank
            FROM cognitive_scores
            WHERE patient_id = %s
        )
        SELECT 
            id,
            patient_id,
            observations,
            assessment_date,
            created_at,
            updated_at,
            scores,
            tool_used
        FROM RankedScores
        WHERE rank = 1
        ORDER BY tool_used;
    """
    
    conn = get_db_connection()
    # Create cursor and execute query
    cur = conn.cursor()
    cur.execute(query, (patient_id,))
    
    # Fetch all results
    results = cur.fetchall()
    
    # Close cursor and connection
    cur.close()
    conn.close()
    
    # List to store mean scores
    mean_scores: dict[str, int] = {}
    
    # Process each result
    for result in results:
        tool_used = result['tool_used']
        try:
            scores_json = result['scores']
            # Parse JSON and calculate mean of all numeric values
            scores = json.loads(scores_json)
            # Calculate mean and round to integer
            mean_score = int(round(sum(float(value) for value in scores.values()) / len(scores)))
            mean_scores[tool_used] = mean_score
        except (json.JSONDecodeError, TypeError, ValueError):
            # If there's an error parsing a specific score, append None or skip
            mean_scores[tool_used] = 0

    return [mean_scores['MCCB'], mean_scores['CAI'], mean_scores['SCoRS'], mean_scores['BACS'], mean_scores['RBANS']]

def main():

    # Set up argument parser
    parser = argparse.ArgumentParser(description='Prediction cognitive status of patient')
    parser.add_argument('--patient-id', type=str, required=True,
                      help='The ID of the patient to run the prediction')
    
    args = parser.parse_args()

    new_predictor = MentalHealthPredictor()
    model_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "models/model")
    new_predictor.load_models(model_path)

    # Make predictions for a new patient

    try:    
        patient = get_patient(args.patient_id)
        predictions = new_predictor.predict(patient)

        # Prepare JSON response
        response = {
            "patient_id": predictions['patient_id'],
            "cognitive_decline_risk": {
                "risk_level": predictions['cognitive_decline_risk']['risk_level'],
                "probability": predictions['cognitive_decline_risk']['probability']
            },
            "relapse_risk": {
                "risk_level": predictions['relapse_risk']['risk_level'],
                "probability": predictions['relapse_risk']['probability']
            },
            "anomaly_detection": {
                "is_anomaly": predictions['is_anomaly'],
                "anomaly_score": predictions['anomaly_score']
            }
        }

        # Output JSON to stdout
        print(json.dumps(response))

    except Exception as e:
        # If an error occurs, return error information as JSON
        error_response = {
            "error": str(e)
        }
        print(json.dumps(error_response))
        sys.exit(1)

        #print("\nPredictions for new patient:")
        #print(f"Patient ID: {predictions['patient_id']}")
        #print(f"Cognitive Decline Risk: {predictions['cognitive_decline_risk']['risk_level']} "
        #        f"({predictions['cognitive_decline_risk']['probability']}%)")
        #print(f"Relapse Risk: {predictions['relapse_risk']['risk_level']} "
        #        f"({predictions['relapse_risk']['probability']}%)")
        #print(f"Anomaly Detection: {predictions['is_anomaly']} (score: {predictions['anomaly_score']})")

if __name__ == "__main__":
    main()