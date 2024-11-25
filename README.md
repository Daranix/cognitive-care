# Cognitive Care

_Empowering Mental Health Through Innovation | Innovando en Salud Mental_

- [Readme English](#english-version)
- [Spanish](#spanish-version)

#### [English Version]

## About
Cognitive Care is a comprehensive digital platform developed during the 2024 Boehringer Ingelheim Hackathon. The solution aims to assist psychiatrists in monitoring, evaluating, and predicting cognitive decline in schizophrenia patients.

## The Challenge
Dr. Javier, a dedicated psychiatrist, seeks to go beyond simple cognitive function assessment in his schizophrenia patients. This chronic mental illness affects how a person thinks, feels, and behaves, with cognitive decline being a common symptom that significantly impacts quality of life. The challenge was to develop a system that assists in identifying cognitive decline risk patterns, predicting possible relapses, and designing personalized interventions in a dynamic digital environment.

## Technical Architecture

### Backend (Processing Core)
- **Base Technologies:**
  - Node.js with Nest.js and Express.js
  - PostgreSQL 17
- **Data Management:**
  - Clinical information storage
  - Cognitive assessment records (MATRICS, CAI, SCoRS, BACS, RBACS)
  - Session transcriptions and AI analysis
- **ORM:** Drizzle
- **API Documentation:** Swagger/OpenAPI

### Frontend (Clinical Interface)
- Angular application featuring:
  - Patient dashboard
  - Patient details
  - Cognitive assessment records
  - Appointment management
  - Audio upload and transcription
  - Relapse and cognitive decline risk status

### Advanced Processing Modules
- **Automated Transcription System:**
  - Whisper for speech-to-text
  - Claude LLM for clinical insights
- **Predictive Risk Engine:**
  - Machine learning models for cognitive decline
  - Relapse risk assessment
- **Specialized Linguistic Analysis:**
  - ScispaCy (en_core_sci_lg model)
  - Semantic analysis of symptoms

# Additional Documentation

- Future Improvements Document: Details potential platform enhancements and upgrades
- Sources and References: Comprehensive list of academic and technical sources used in development
- Documentation link: <https://github.com/Daranix/cognitive-care/blob/master/cognitive-care-doc-references/hackaton.md>

---

[Versión en Español]

## Acerca de
Cognitive Care es una plataforma digital integral desarrollada durante el Hackathon 2024 de Boehringer Ingelheim. La solución busca asistir a psiquiatras en el monitoreo, evaluación y predicción del deterioro cognitivo en pacientes con esquizofrenia.

## El Reto
El Dr. Javier, un psiquiatra dedicado, busca ir más allá de la simple evaluación de la función cognitiva en sus pacientes con esquizofrenia. Esta enfermedad mental crónica afecta la forma en que una persona piensa, siente y se comporta, siendo el deterioro cognitivo un síntoma común que impacta significativamente en la calidad de vida. El reto consistió en desarrollar un sistema que ayude a identificar patrones de riesgo de deterioro cognitivo, predecir posibles recaídas y diseñar intervenciones personalizadas en un entorno digital dinámico.

## Arquitectura Técnica

### Backend (Núcleo de Procesamiento)
- **Tecnologías Base:**
  - Node.js con Nest.js y Express.js
  - PostgreSQL 17
- **Gestión de Datos:**
  - Almacenamiento de información clínica
  - Registro de evaluaciones cognitivas (MATRICS, CAI, SCoRS, BACS, RBACS)
  - Transcripciones de sesiones y análisis de IA
- **ORM:** Drizzle
- **Documentación API:** Swagger/OpenAPI

### Frontend (Interfaz Clínica)
- Aplicación Angular con:
  - Dashboard de pacientes
  - Detalles del paciente
  - Registro de evaluaciones cognitivas
  - Gestión de citas
  - Subida de audio y transcripción
  - Estado de riesgo de recaída y deterioro cognitivo

### Módulos de Procesamiento Avanzado
- **Sistema de Transcripción Automatizada:**
  - Whisper para speech-to-text
  - Claude LLM para insights clínicos
- **Motor Predictivo de Riesgo:**
  - Modelos de machine learning para deteccion de deterioro cognitivo
  - Prediccion de recaidas
- **Procesamiento del lenguaje natural:**
  - ScispaCy (en_core_sci_lg model)
  - Analisis semantico con el objetivo de detectar sintomas

# Documentación Adicional

- Documento de Mejoras Futuras: Detalla posibles mejoras y actualizaciones de la plataforma
- Fuentes y Referencias: Lista completa de fuentes académicas y técnicas utilizadas en el desarrollo
- Repositorio de Documentación: <https://github.com/Daranix/cognitive-care/blob/master/cognitive-care-doc-references/hackaton.md>