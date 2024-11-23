import { DOMAIN_LABELS } from "./cognitive-score-dialog.constants"

export interface CognitiveTool {
    name: string
    acronym: string
    description: string
    domains_evaluated: CognitiveDomainKey[]
    advantages?: string
}

export type CognitiveDomainKey = keyof typeof DOMAIN_LABELS;