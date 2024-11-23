export interface StreamResponse {
    text?: string;
    eventType: 'text' | 'close';
}