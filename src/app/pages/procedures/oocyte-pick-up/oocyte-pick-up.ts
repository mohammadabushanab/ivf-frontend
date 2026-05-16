import { Component, Input } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'app-oocyte-pick-up',
  imports: [],
  templateUrl: './oocyte-pick-up.html',
  styleUrl: './oocyte-pick-up.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class OocytePickUp {
  @Input()
  procedure!: Procedure;

 
}
