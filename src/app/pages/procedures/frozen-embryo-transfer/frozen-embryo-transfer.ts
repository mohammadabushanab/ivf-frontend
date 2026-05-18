import { Component, Input } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-frozen-embryo-transfer',
  imports: [CommonModule,FormsModule],
  templateUrl: './frozen-embryo-transfer.html',
  styleUrl: './frozen-embryo-transfer.css',
})
export class FrozenEmbryoTransfer {
  @Input()
  procedure!: Procedure;
}
