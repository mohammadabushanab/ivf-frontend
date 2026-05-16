import { Component, Input } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { NumbersOnly } from '../../../shared/directives/numbers-only';
import { TextOnly } from '../../../shared/directives/text-only';

@Component({
  selector: 'app-retrograde-ejaculate-analysis',
  imports: [FormsModule, CommonModule, NumbersOnly, TextOnly],
  templateUrl: './retrograde-ejaculate-analysis.html',
  styleUrl: './retrograde-ejaculate-analysis.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class RetrogradeEjaculateAnalysis {
  @Input()
  procedure!: Procedure;
}
