import json
import random
import numpy as np

def generate_schizophrenia_dataset(num_patients=100):
    symptoms_pool = [
        "hallucinations", "delusions", "disorganized speech", 
        "social withdrawal", "paranoia", "flat affect", 
        "reduced emotional expression", "thought disorder"
    ]
    
    dataset = []
    
    for patient_id in range(1, num_patients + 1):
        age = max(18, int(np.random.normal(40, 10)))
        
        # Base cognitive score generation
        base_score = random.randint(65, 95)
        cognitive_scores = [
            base_score, # mccb
            base_score - random.randint(3, 7), # cai
            base_score - random.randint(5, 10), # SCoRS
            base_score - random.randint(8, 15), # BACS
            base_score - random.randint(3, 10) # RBANS
        ]
        
        # Count scores below 64
        low_scores_count = sum(score < 64 for score in cognitive_scores)
        
        # Determine relapse
        relapsed = low_scores_count > 3 or (low_scores_count > 2 and age > 45)
        
        # Generate symptoms
        num_symptoms = random.randint(2, 3)
        symptoms = random.sample(symptoms_pool, num_symptoms)
        
        patient = {
            "patient_id": patient_id,
            "age": age,
            "symptoms": symptoms,
            "cognitive_scores": cognitive_scores,
            "relapsed": relapsed
        }
        
        dataset.append(patient)
    
    return dataset

# Generate dataset
schizophrenia_patients = generate_schizophrenia_dataset()

# Save to JSON file
with open('dataset.json', 'w') as f:
    json.dump(schizophrenia_patients, f, indent=2)

print("Dataset saved to dataset.json")
