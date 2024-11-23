import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score

import json
from mental_health_predictor import MentalHealthPredictor

# Assume we have a dataset with the following structure:
# data = [
#     {"patient_id": 1, "age": 35, "symptoms": ["hallucinations", "disorganized speech"], "cognitive_scores": [85, 82, 78, 75], "relapsed": True},
#     {"patient_id": 2, "age": 42, "symptoms": ["delusions", "social withdrawal"], "cognitive_scores": [92, 90, 88, 86], "relapsed": False},
#     # more patient data
# ]

def preprocess_data(data):
    X = []
    y_cognitive = []
    y_relapse = []

    for patient in data:
        X.append([patient["age"]] + patient["cognitive_scores"])
        y_cognitive.append(1 if np.mean(patient["cognitive_scores"]) < 80 else 0)
        y_relapse.append(1 if patient["relapsed"] else 0)

    return np.array(X), np.array(y_cognitive), np.array(y_relapse)

def train_cognitive_decline_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)

    print(f"Cognitive Decline Model Performance:")
    print(f"Accuracy: {accuracy:.2f}")
    print(f"F1-Score: {f1:.2f}")
    print(f"Precision: {precision:.2f}")
    print(f"Recall: {recall:.2f}")

    return model

def train_relapse_prediction_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LogisticRegression(random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)

    print(f"Relapse Prediction Model Performance:")
    print(f"Accuracy: {accuracy:.2f}")
    print(f"F1-Score: {f1:.2f}")
    print(f"Precision: {precision:.2f}")
    print(f"Recall: {recall:.2f}")

    return model

def detect_anomalies(X, model):
    anomaly_detector = IsolationForest(random_state=42)
    anomaly_detector.fit(X)
    anomalies = anomaly_detector.predict(X)
    return anomalies

def main():
    with open('dataset.json', 'r') as file:
        data = json.load(file)
    X, y_cognitive, y_relapse = preprocess_data(data)
    
    predictor = MentalHealthPredictor()
    predictor.cognitive_decline_model = train_cognitive_decline_model(X, y_cognitive)
    predictor.relapse_prediction_model = train_relapse_prediction_model(X, y_relapse)
    predictor.anomaly_detector = IsolationForest(random_state=42).fit(X)
    
    # Save models
    predictor.save_models("models/model")

if __name__ == "__main__":
    main()