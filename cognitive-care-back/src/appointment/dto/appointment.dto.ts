export class AppointmentDto {
    date: Date;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    patientId: string;
    audioFile?: string;
    notes?: string;
    transcription?: string;
    transcriptionSummary?: string;
}