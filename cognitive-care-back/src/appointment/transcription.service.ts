import { Injectable, Logger } from "@nestjs/common";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { platform } from "node:os";
import { join } from "node:path";
import { TranscriptionDto } from "./dto/transcription.dto";

@Injectable()

export class TranscriptionService {

    private readonly pythonScriptBasePath = process.env.PYTHON_SCRIPTS_BASE_PATH;
    private readonly logger = new Logger(TranscriptionService.name);

    private getPythonBinary() {
        const venvPath = join(this.pythonScriptBasePath, '.venv');
        
        if(!existsSync(venvPath)) {
            return 'python';
        }

        const binary = platform() === 'win32' ? 'python.exe' : 'python';
        return join(venvPath, 'Scripts', binary);
    }

    async transcribeAppointment(appointmentId: string): Promise<TranscriptionDto> {
        return new Promise((resolve, reject) => {
            const transcriptionProcess = spawn(this.getPythonBinary(), [
                join(this.pythonScriptBasePath, 'transcriber.py'),
                '--appointment-id',
                appointmentId.toString()
            ], {
                env: {
                    ...process.env, // Pass through all environment variables
                    PYTHONUNBUFFERED: '1' // Ensures Python prints are not buffered
                }
            });

            const transcriptionData = [];
            const errorData = [];

            transcriptionProcess.stdout.on('data', (data) => {
                const output = data.toString();
                this.logger.debug(`Python stdout: ${output}`);
                transcriptionData.push(output);
            });

            transcriptionProcess.stderr.on('data', (data) => {
                const error = data.toString();
                this.logger.debug(`Python stderr: ${error}`);
                errorData.push(error);
            });

            transcriptionProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Transcription process exited with code ${code}\nErrors: ${errorData.join('')}`));
                    return;
                }

                // Parse the output to extract segments and language info
                try {
                    const output = transcriptionData.join('');
                    const segments = [];
                    let languageInfo = null;

                    // Parse the output lines
                    const lines = output.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('Detected language')) {
                            languageInfo = line;
                        } else if (line.match(/^\[\d+\.\d+s ->/)) {
                            segments.push(line);
                        }
                    }

                    resolve({
                        languageInfo,
                        segments,
                        rawOutput: output
                    });
                } catch (error) {
                    reject(new Error(`Failed to parse transcription output: ${error.message}`));
                }
            });

            transcriptionProcess.on('error', (error) => {
                reject(new Error(`Failed to start transcription process: ${error.message}`));
            });
        });
    }
}