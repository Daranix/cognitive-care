import { CognitiveTool } from "./cognitive-tool.model"

export const DOMAIN_LABELS = {
    "PROC_SPEED": "Processing Speed",
    "ATTN_VIG": "Attention/Vigilance",
    "ATTN_GEN": "General Attention",
    "WORK_MEM": "Working Memory",
    "VERB_LEARN": "Verbal Learning",
    "VERB_MEM": "Verbal Memory",
    "VERB_FLU": "Verbal Fluency",
    "VIS_LEARN": "Visual Learning",
    "VIS_SPAT": "Visuospatial Skills",
    "REAS_PROB": "Reasoning and Problem Solving",
    "SOC_COG": "Social Cognition",
    "EXEC_FUNC": "Executive Functions",
    "MEM_GEN": "General Memory",
    "MEM_IMM": "Immediate Memory",
    "MEM_DEL": "Delayed Memory",
    "LANG_GEN": "General Language"
}

export const COGNITIVE_TOOLS: Array<CognitiveTool> = [
    {
        "name": "MATRICS Consensus Cognitive Battery",
        "acronym": "MCCB",
        "description": "Most widely used tool for assessing cognitive impairment in schizophrenia. Developed as part of the MATRICS initiative (Measurement and Treatment Research to Improve Cognition in Schizophrenia).",
        "domains_evaluated": [
            "PROC_SPEED",
            "ATTN_VIG",
            "WORK_MEM",
            "VERB_LEARN",
            "VIS_LEARN",
            "REAS_PROB",
            "SOC_COG"
        ],
        "advantages": "Standardized and useful for both research and clinical practice."
    },
    {
        "name": "Cognitive Assessment Interview",
        "acronym": "CAI",
        "description": "Semi-structured interview that assesses cognitive impairment based on patient and informant perception.",
        "domains_evaluated": [
            "MEM_GEN",
            "PROC_SPEED",
            "ATTN_GEN",
            "EXEC_FUNC"
        ],
        "advantages": "Considers subjective perspective of patient and their environment."
    },
    {
        "name": "Brief Assessment of Cognition in Schizophrenia",
        "acronym": "BACS",
        "description": "Brief and easy-to-administer test that measures cognitive impairment in a general way.",
        "domains_evaluated": [
            "VERB_MEM",
            "VERB_FLU",
            "PROC_SPEED",
            "WORK_MEM",
            "REAS_PROB"
        ],
        "advantages": "Administered in less than 35 minutes and has well-established norms."
    },
    {
        "name": "Schizophrenia Cognition Rating Scale",
        "acronym": "SCoRS",
        "description": "Evaluates the functional impact of cognitive impairment based on information provided by the patient, an informant, and the evaluator.",
        "domains_evaluated": [
            "EXEC_FUNC",
            "MEM_GEN",
            "SOC_COG"
        ],
        "advantages": "Considers cognitive impairment in the context of daily functioning."
    },
    {
        "name": "Repeatable Battery for the Assessment of Neuropsychological Status",
        "acronym": "RBANS",
        "description": "Although not specifically designed for schizophrenia, it is widely used to assess cognitive impairment in clinical populations.",
        "domains_evaluated": [
            "ATTN_GEN",
            "LANG_GEN",
            "MEM_IMM",
            "MEM_DEL",
            "VIS_SPAT"
        ]
    }
]