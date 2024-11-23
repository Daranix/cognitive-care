import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, firstValueFrom, map, mergeMap, Observable } from 'rxjs';
import { StreamResponse } from './dtos/stream-response.dto';


@Injectable()
export class LlmService {

  private readonly logger = new Logger(LlmService.name);

  constructor(
    private readonly httpService: HttpService
  ) {}

  sendLlmRequest({ system, user }: { system: string; user: string}) {

    return this.httpService.post('https://api.anthropic.com/v1/messages', {
      model: "claude-3-sonnet-20240229",
      system,
      messages: [
        {
          role: "user",
          content: user
        }
      ],
      max_tokens: 1024,
      stream: true  // Enable streaming
    }, {
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      responseType: 'stream'
    }).pipe(
      map(response => response.data),
      mergeMap(stream => new Observable<MessageEvent<StreamResponse>>(subscriber => {
        stream.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim());
          for (const line of lines) {
            const text = this.parseStreamLine(line);
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            if (text) subscriber.next({ data: { text, eventType: 'text' } } as any);
          }
        });

        stream.on('end', () => {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          subscriber.next({ data: { eventType: 'close' } } as any)
          subscriber.complete();
        });
        
        stream.on('error', (error) => {
          this.logger.error('Stream error:', error);
          subscriber.error(error);
        });

        return () => stream.destroy();
      })),
      catchError(error => {
        this.logger.error('Request error:', error);
        throw error;
      })
    );
  }

  private parseStreamLine(line: string): string | null {
    if (!line.startsWith('data: ')) return null;
    
    const jsonString = line.slice(6);
    if (jsonString === '[DONE]') return null;
    
    try {
      const data = JSON.parse(jsonString);
      return data.type === 'content_block_delta' ? data.delta?.text ?? null : null;
    } catch (e) {
      this.logger.error('Error parsing JSON:', e);
      return null;
    }
  }
}
