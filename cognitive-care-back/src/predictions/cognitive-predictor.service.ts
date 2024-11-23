import { Injectable, Logger } from "@nestjs/common";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { platform } from "node:os";
import { join } from "node:path";
import { PredictionDataDto } from "src/predictions/dto/prediction-data.dto";

@Injectable()
export class CognitivePredictor {

    private readonly pythonScriptBasePath = process.env.PYTHON_SCRIPTS_BASE_PATH;
    private readonly logger = new Logger(CognitivePredictor.name);

    private getPythonBinary() {
        const venvPath = join(this.pythonScriptBasePath, '.venv');
        
        if(!existsSync(venvPath)) {
            return 'python';
        }

        const binary = platform() === 'win32' ? 'python.exe' : 'python';
        return join(venvPath, 'Scripts', binary);
    }

    async predict(patientId: string): Promise<PredictionDataDto> {

        return new Promise((resolve, reject) => {

            const pythonProcess = spawn(this.getPythonBinary(), [
                join(this.pythonScriptBasePath, 'cognitivecare', 'predictions.py'),
                '--patient-id',
                patientId
            ], {
                env: {
                    ...process.env, // Pass through all environment variables
                    PYTHONUNBUFFERED: '1', // Ensures Python prints are not buffered
                    SHOW_WARNINGS: 'no'
                }
            });

            let stdoutData = '';
            let stderrData = '';
    
            // Capture stdout
            pythonProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
            });
    
            // Capture stderr (warnings or errors)
            pythonProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
            });
    
            pythonProcess.on('close', (code) => {
                // Handle stderr if any
                if (stderrData) {
                    this.logger.warn('Python script warnings/errors:', stderrData)
                }
    
                try {
                    // Parse stdout as JSON
                    const result = JSON.parse(stdoutData.trim());
                    this.logger.debug(`Prediction for patient_id: ${patientId} - ${stdoutData.trim()}`);
                    if(result.error) {
                        throw new Error(result.error);
                    }
                    resolve(result as PredictionDataDto);
                } catch (err) {
                    this.logger.error('Failed to parse JSON from Python script:', err);
                    this.logger.error('Raw output:', stdoutData);
                    reject(err);
                }
    
                this.logger.debug(`Python script exited with code ${code}`);
            });
        })

    }

}