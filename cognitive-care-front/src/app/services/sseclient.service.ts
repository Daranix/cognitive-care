import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamResponse } from '../utils/models/stream-response.dto';

@Injectable({
  providedIn: 'root'
})
export class SseclientService {


  summarizeTranscription(appointmentId: string) {
    return new Observable<StreamResponse>((next) => {
      const url = `${environment.BASE_URL}/appointment/${appointmentId}/transcription-sumarize`;
      const eventSource = new EventSource(url);
      eventSource.onmessage = (v: MessageEvent) => {
        const data = JSON.parse(v.data) as StreamResponse;
        next.next(data);
        if(data.eventType === 'close') {
          next.complete();
          eventSource.close();
        }
      };

      
      eventSource.onerror = (err) => {
        next.error(err);
        eventSource.close();
      }
    });
  }
}


