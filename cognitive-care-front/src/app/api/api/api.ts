export * from './app.service';
import { AppService } from './app.service';
export * from './app.serviceInterface';
export * from './patient.service';
import { PatientService } from './patient.service';
export * from './patient.serviceInterface';
export const APIS = [AppService, PatientService];
