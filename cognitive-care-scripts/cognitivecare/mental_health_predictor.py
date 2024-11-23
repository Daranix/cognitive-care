import joblib
import pickle
import numpy as np
from typing import Dict, List, Tuple, Any

class MentalHealthPredictor:
    def __init__(self):
        self.cognitive_decline_model = None
        self.relapse_prediction_model = None
        self.anomaly_detector = None
    
    def save_models(self, save_path: str) -> None:
        """
        Save all trained models to disk.
        
        Args:
            save_path (str): Base path where models will be saved
        """
        if self.cognitive_decline_model is not None:
            joblib.dump(self.cognitive_decline_model, f"{save_path}_cognitive.joblib")
        if self.relapse_prediction_model is not None:
            joblib.dump(self.relapse_prediction_model, f"{save_path}_relapse.joblib")
        if self.anomaly_detector is not None:
            joblib.dump(self.anomaly_detector, f"{save_path}_anomaly.joblib")
    
    def load_models(self, load_path: str) -> None:
        """
        Load all models from disk.
        
        Args:
            load_path (str): Base path where models were saved
        """
        try:
            self.cognitive_decline_model = joblib.load(f"{load_path}_cognitive.joblib")
            self.relapse_prediction_model = joblib.load(f"{load_path}_relapse.joblib")
            self.anomaly_detector = joblib.load(f"{load_path}_anomaly.joblib")
        except FileNotFoundError as e:
            print(f"Error loading models: {e}")
    
    def preprocess_new_data(self, patient_data: Dict[str, Any]) -> np.ndarray:
        """
        Preprocess a single patient's data for prediction.
        
        Args:
            patient_data (dict): Dictionary containing patient information
            
        Returns:
            np.ndarray: Preprocessed features for prediction
        """
        features = [patient_data["age"]] + patient_data["cognitive_scores"]
        return np.array(features).reshape(1, -1)
    
    def predict(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make predictions for a single patient using all models.
        
        Args:
            patient_data (dict): Dictionary containing patient information
            
        Returns:
            dict: Dictionary containing all predictions
        """
        if not all([self.cognitive_decline_model, self.relapse_prediction_model, self.anomaly_detector]):
            raise ValueError("Models not loaded. Please load models first.")
        
        X = self.preprocess_new_data(patient_data)
        
        cognitive_decline_prob = self.cognitive_decline_model.predict_proba(X)[0][1]
        relapse_prob = self.relapse_prediction_model.predict_proba(X)[0][1]
        anomaly_score = self.anomaly_detector.score_samples(X)[0]
        
        return {
            "patient_id": patient_data["patient_id"],
            "cognitive_decline_risk": {
                "probability": round(cognitive_decline_prob * 100, 2),
                "risk_level": "High" if cognitive_decline_prob >= 0.7 else "Medium" if cognitive_decline_prob >= 0.3 else "Low"
            },
            "relapse_risk": {
                "probability": round(relapse_prob * 100, 2),
                "risk_level": "High" if relapse_prob >= 0.7 else "Medium" if relapse_prob >= 0.3 else "Low"
            },
            "anomaly_score": round(anomaly_score, 2),
            "is_anomaly": "Yes" if anomaly_score < -0.5 else "No"
        }