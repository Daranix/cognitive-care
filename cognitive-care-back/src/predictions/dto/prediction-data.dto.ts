export class PredictionDataDto {
    patient_id: number
    cognitive_decline_risk: CognitiveDeclineRisk
    relapse_risk: RelapseRisk
    anomaly_detection: AnomalyDetection
}

export class CognitiveDeclineRisk {
    risk_level: string; // Hight or Low
    probability: number;
}

export class RelapseRisk {
    risk_level: string // Hight or Low
    probability: number
}

export class AnomalyDetection {
    is_anomaly: boolean
    anomaly_score: number
}
