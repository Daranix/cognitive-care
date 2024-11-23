import spacy
from collections import Counter
from typing import List, Dict, Any
import re
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Symptom:
    text: str
    severity: float  # 0-1 scale
    frequency: str   # e.g., "daily", "occasional"
    duration: str    # e.g., "2 weeks", "chronic"
    context: str     # surrounding text

class ClinicalNLPAnalyzer:
    def __init__(self, model_name: str = "en_core_sci_lg"):
        """
        Initialize the Clinical NLP Analyzer with specified model.
        
        Args:
            model_name: Name of the spaCy model to use
        """
        self.nlp = spacy.load(model_name)
        
        # Common symptom-related terms and patterns
        self.severity_terms = {
            'mild': 0.3,
            'moderate': 0.6,
            'severe': 0.9,
            'slight': 0.2,
            'intense': 0.8,
            'extreme': 1.0
        }
        
        self.frequency_patterns = [
            (r'(\d+)\s*times?\s*(per|a)\s*(day|week|month)', 'frequent'),
            (r'(daily|constantly|continuously)', 'daily'),
            (r'(occasionally|sometimes|intermittently)', 'occasional'),
            (r'(rarely|seldom)', 'rare')
        ]
        
        # Custom symptom patterns
        self.symptom_patterns = [
            [{"LOWER": {"IN": ["pain", "ache", "discomfort"]}},
             {"OP": "?"}, 
             {"LOWER": {"IN": ["in", "on", "around"]}},
             {"OP": "?"},
             {"ENT_TYPE": "BODY_PART"}],
            [{"ENT_TYPE": "SYMPTOM"}],
            [{"LOWER": {"REGEX": r".*ache$"}}],
            [{"LOWER": {"IN": ["feeling", "experiencing", "complaining", "reports"]}},
             {"OP": "?"},
             {"LOWER": "of"},
             {"OP": "?"},
             {"ENT_TYPE": "SYMPTOM"}]
        ]
        
        # Add custom patterns to pipeline
        ruler = self.nlp.get_pipe("entity_ruler") if "entity_ruler" in self.nlp.pipe_names else self.nlp.add_pipe("entity_ruler")
        for pattern in self.symptom_patterns:
            ruler.add_patterns([{"label": "SYMPTOM", "pattern": pattern}])

    def _extract_duration(self, text: str) -> str:
        """Extract duration information from text."""
        duration_patterns = [
            r'for\s+(\d+\s+(?:days?|weeks?|months?|years?))',
            r'(?:since|for the past|for the last)\s+(\d+\s+(?:days?|weeks?|months?|years?))',
            r'(\d+\s+(?:days?|weeks?|months?|years?))\s+(?:duration|history)'
        ]
        
        for pattern in duration_patterns:
            match = re.search(pattern, text.lower())
            if match:
                return match.group(1)
        return "unspecified"

    def _extract_severity(self, text: str) -> float:
        """Extract severity score from text."""
        words = text.lower().split()
        max_severity = 0.0
        
        for word in words:
            if word in self.severity_terms:
                max_severity = max(max_severity, self.severity_terms[word])
                
        # Look for numeric pain scales
        pain_scale_match = re.search(r'pain\s+(?:scale|level|score)?(?:\s+of)?\s+(\d+)(?:/10)?', text.lower())
        if pain_scale_match:
            numeric_severity = float(pain_scale_match.group(1)) / 10
            max_severity = max(max_severity, numeric_severity)
            
        return max_severity if max_severity > 0 else 0.5  # default to moderate if no severity found

    def _extract_frequency(self, text: str) -> str:
        """Extract frequency information from text."""
        text_lower = text.lower()
        
        for pattern, category in self.frequency_patterns:
            if re.search(pattern, text_lower):
                return category
        
        return "unspecified"

    def _get_context(self, doc: spacy.tokens.Doc, entity_start: int, entity_end: int, window: int = 5) -> str:
        """Get surrounding context for an entity."""
        start = max(0, entity_start - window)
        end = min(len(doc), entity_end + window)
        return doc[start:end].text

    #def extract_symptoms(self, clinical_notes: str) -> List[Symptom]:
    #    """
    #    Extract symptoms and their attributes from clinical notes.
    #    
    #    Args:
    #        clinical_notes: Raw text of clinical notes
    #        
    #    Returns:
    #        List of Symptom objects containing detailed symptom information
    #    """
    #    doc = self.nlp(clinical_notes)
    #    symptoms = []
    #    
    #    # Process each sentence separately
    #    for sent in doc.sents:
    #        sent_text = sent.text.lower()
    #        
    #        # Extract entities marked as symptoms
    #        for ent in sent.ents:
    #            if ent.label_ == "SYMPTOM":
    #                symptom = Symptom(
    #                    text=ent.text,
    #                    severity=self._extract_severity(sent_text),
    #                    frequency=self._extract_frequency(sent_text),
    #                    duration=self._extract_duration(sent_text),
    #                    context=self._get_context(doc, ent.start, ent.end)
    #                )
    #                symptoms.append(symptom)
    #    
    #    return symptoms

    def extract_symptoms(self, clinical_notes: str):
        """
        Extracts symptoms from clinical notes using NLP.
        
        Parameters:
        clinical_notes (str): Raw text of clinical notes.
        
        Returns:
        list: A list of identified symptoms.
        """
        # Process the clinical notes with the NLP model
        doc = self.nlp(clinical_notes)
        
        # Extract symptoms as named entities
        symptoms = [ent.text for ent in doc.ents if ent.label_ == "SYMPTOM"]
        
        # Additionally, look for symptom-related noun chunks and tokens
        additional_symptoms = [
            chunk.text for chunk in doc.noun_chunks 
            if any(keyword in chunk.text.lower() for keyword in [
                "pain", "ache", "discomfort", "symptom", "feeling", 
                "difficulty", "problem", "issue", "condition"
            ])
        ]
        
        # Combine and deduplicate symptoms
        all_symptoms = list(set(symptoms + additional_symptoms))
        return all_symptoms

    def analyze_clinical_notes(self, clinical_notes: str) -> Dict[str, Any]:
        """
        Comprehensive analysis of clinical notes.
        
        Args:
            clinical_notes: Raw text of clinical notes
            
        Returns:
            Dictionary containing extracted information including symptoms,
            conditions, treatments, and related metadata
        """
        doc = self.nlp(clinical_notes)
        
        # Extract symptoms
        symptoms = self.extract_symptoms(clinical_notes)
        
        # Extract other relevant information
        entities = {
            "CONDITIONS": [ent.text for ent in doc.ents if ent.label_ == "CONDITION"],
            "TREATMENTS": [ent.text for ent in doc.ents if ent.label_ == "TREATMENT"],
            "MEDICATIONS": [ent.text for ent in doc.ents if ent.label_ == "MEDICATION"]
        }
        
        # Analyze temporal information
        temporal_refs = [ent.text for ent in doc.ents if ent.label_ in ["DATE", "TIME"]]
        
        return {
            "symptoms": symptoms,
            "entities": entities,
            "temporal_references": temporal_refs,
            "analysis_timestamp": datetime.now().isoformat()
        }



def detect_symptoms(clinical_notes: str):
    if clinical_notes is None or clinical_notes == "":
        return []
    analyzer = ClinicalNLPAnalyzer()
    results = analyzer.analyze_clinical_notes(clinical_notes.strip())
    return results['symptoms']