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
        
        relapse_probability = 0.4 if age < 30 else 0.6
        relapsed = random.random() < relapse_probability
        
        num_symptoms = random.randint(2, 3)
        symptoms = random.sample(symptoms_pool, num_symptoms)
        
        base_score = random.randint(85, 95)
        cognitive_scores = [
            base_score, # mccb
            base_score - random.randint(3, 7), # cai
            base_score - random.randint(5, 10), #SCoRS
            base_score - random.randint(8, 15), # BACS
            base_score - random.randint(3, 10) # RBANS
        ]
        
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