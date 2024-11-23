import { AfterViewInit, Component, ElementRef, inject, model, signal, viewChild } from '@angular/core';
import { COGNITIVE_TOOLS, DOMAIN_LABELS } from './cognitive-score-dialog.constants';
import { FormsModule, NgForm } from '@angular/forms';
import { CognitiveDomainKey, CognitiveTool } from './cognitive-tool.model';
import { ButtonComponent } from '../components/common/button/button.component';
import {Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CognitiveScoreDto, CognitiveScoresService } from '../api';
import { firstValueFrom } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-cognitive-score-dialog',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './cognitive-score-dialog.component.html',
  styleUrl: './cognitive-score-dialog.component.scss'
})
export class CognitiveScoreDialogComponent implements AfterViewInit {

  private readonly cognitiveScoresService = inject(CognitiveScoresService);
  private readonly dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  private readonly data = inject<{ patientId: string, cognitiveScore?: CognitiveScoreDto }>(DIALOG_DATA);
  private readonly hotToastService = inject(HotToastService);

  readonly domainLabels = DOMAIN_LABELS;
  readonly cognitiveTools = COGNITIVE_TOOLS;
  readonly cognitiveToolSelected = model<CognitiveTool>(this.cognitiveTools[0]);
  private readonly cognitiveScoreFormRef = viewChild<NgForm>('cognitiveScoreForm');

  readonly isSaving = signal(false);

  ngAfterViewInit(): void {
    if(this.data.cognitiveScore) {
      setTimeout(() => {
        this.cognitiveScoreFormRef()?.control.patchValue({
          cognitiveTool: this.cognitiveTools.find((tool) => tool.acronym === this.data.cognitiveScore!.toolUsed),
        });
        
        setTimeout(() => {
          this.cognitiveScoreFormRef()?.control.patchValue({
            ...this.data.cognitiveScore!.scores
          });
        });
      })
    }
  }

  getDomainNameByAcronim(domainKey: CognitiveDomainKey) {
    return this.domainLabels[domainKey];
  }

  async saveCognitiveScore(form: NgForm) {
    
    const { cognitiveTool, ...scores } = form.value as { cognitiveTool: CognitiveTool } & Record<CognitiveDomainKey, number>;
    try {
      await firstValueFrom(this.cognitiveScoresService.createOrUpdateCognitiveScore({
        createCognitiveScoreDto: {
          assessmentDate: new Date().toISOString(),
          patientId: this.data.patientId,
          scores,
          toolUsed: cognitiveTool.acronym,
          id: this.data.cognitiveScore?.id
        }
      }));

      this.dialogRef.close('success');

    } catch(ex) {
      this.hotToastService.error('Error trying to create the cognition score record');
      console.log('Error trying to create the cognition score record', ex);
    }


  }

}
