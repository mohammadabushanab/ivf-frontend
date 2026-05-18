import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { NumbersOnly } from '../../../shared/directives/numbers-only';
import { TextOnly } from '../../../shared/directives/text-only';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-ovarian-tissue-cryopreservation',
  imports: [FormsModule, CommonModule],
  templateUrl: './ovarian-tissue-cryopreservation.html',
  styleUrl: './ovarian-tissue-cryopreservation.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class OvarianTissueCryopreservation {

  @Input()
  procedure!: Procedure;

  embryologists = signal<User[]>([]);

  private userService = inject(UserService);

  async ngOnInit(): Promise<void> {
    
    let searchCriteria: User = {
      id: '',
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'Embryologist',
      token: '',
      isLoggedIn: false,
      newPassword: ''
    };

    const usersByRole = await this.userService.getUsersByRole(searchCriteria);
    this.embryologists.set(usersByRole);

    if (!this.procedure.values['tissuePieces']) {
      this.procedure.values['tissuePieces'] = [...this.tissuePieces];
    }

    if (!this.procedure.values['tissueThawingRows']) {
      this.procedure.values['tissueThawingRows'] = [...this.tissueThawingRows];
    }

    if (!this.procedure.values['tissueTransplantationRows']) {
      this.procedure.values['tissueTransplantationRows'] = [...this.tissueTransplantationRows];
    }

    this.updateTotalVialsFrozen();
  }

  tissuePieces: any[] = [{
    tissueType: '',
    size: '',
    pieceNo: '',
    quality: '',
    color: ''
  }];

  tissueThawingRows: any[] = [{
    date: '',
    time: '',
    vialsThawed: '',
    piecesThawed: '',
    viability: '',
    embryologist: '',
    witness: '',
    notes: ''
  }];

  tissueTransplantationRows: any[] = [{
    date: '',
    time: '',
    piecesTransplanted: '',
    site: '',
    status: '',
    surgeon: '',
    notes: ''
  }];

  addTissuePiece(): void {
    this.procedure.values['tissuePieces'].push({
      pieceNo: '',
      size: '',
      morphology: '',
      notes: ''
    });
    this.updateTotalVialsFrozen();
  }

  removeTissuePiece(index: number): void {
    this.procedure.values['tissuePieces'].splice(index, 1);

    this.updateTotalVialsFrozen();
  }

  updateTotalVialsFrozen(): void {
    this.procedure.values['totalVialsFrozen'] =
      this.procedure.values['tissuePieces'].length;
  }

  addTissueThawingRow(): void {
    this.procedure.values['tissueThawingRows'].push({
      date: this.today(),
      vialsThawed: 0,
      piecesThawed: 0,
      viability: 0,
      embryologist: '',
      witness: '',
      notes: ''
    });
  }

  removeTissueThawingRow(index: number): void {
    this.procedure.values['tissueThawingRows'].splice(index, 1);
  }

  addTissueTransplantationRow(): void {
    this.procedure.values['tissueTransplantationRows'].push(
      {
        date: this.today(),
        piecesTransplanted: 0,
        site: 'Orthotopic (Ovary)',
        status: 'Successful',
        surgeon: '',
        notes: ''
      }
    );
  }

  removeTissueTransplantationRow(index: number): void {
    this.procedure.values['tissueTransplantationRows'].splice(index, 1);
  }

  today(): string {
    return new Date().toISOString().split('T')[0];
  }

    compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
