import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
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
    if (!this.procedure.values || typeof this.procedure.values !== 'object') {
      this.procedure.values = {};
    }

    const searchCriteria: User = {
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

    if (!Array.isArray(this.procedure.values['tissuePieces'])) {
      this.procedure.values['tissuePieces'] = [...this.tissuePieces];
    }

    if (!Array.isArray(this.procedure.values['tissueThawingRows'])) {
      this.procedure.values['tissueThawingRows'] = [...this.tissueThawingRows];
    }

    this.initDefaultValues();
    this.normalizeTissuePieces();
    this.normalizeTissueThawingRows();

    this.updateTotalTissuePiecesFrozen();
  }

  tissuePieces: any[] = [
    {
      tissueType: '',
      size: '',
      pieceNo: '',
      quality: '',
      color: ''
    }
  ];

  tissueThawingRows: any[] = [
    {
      date: '',
      time: '',
      vialsThawed: '',
      piecesThawed: '',
      viablePieces: '',
      viabilityPercentage: '',
      remainingPieces: '',
      embryologist: '',
      witness: '',
      notes: ''
    }
  ];

  initDefaultValues(): void {
    this.procedure.values['totalTissuePiecesFrozen'] ??= '';
    this.procedure.values['dewar'] ??= '';
    this.procedure.values['numberOfStraws'] ??= '';
    this.procedure.values['strawColors'] ??= '';
    this.procedure.values['cassetteCanNo'] ??= '';
    this.procedure.values['canisterNo'] ??= '';
    this.procedure.values['freezingDate'] ??= '';
    this.procedure.values['freezingWitness'] ??= '';
  }

  addTissuePiece(): void {
    this.procedure.values['tissuePieces'].push({
      tissueType: '',
      size: '',
      pieceNo: '',
      quality: '',
      color: ''
    });

    this.updateTotalTissuePiecesFrozen();
  }

  removeTissuePiece(index: number): void {
    this.procedure.values['tissuePieces'].splice(index, 1);
    this.updateTotalTissuePiecesFrozen();
  }

  updateTotalTissuePiecesFrozen(): void {
    this.procedure.values['totalTissuePiecesFrozen'] =
      this.procedure.values['tissuePieces']?.length || 0;
  }

  addTissueThawingRow(): void {
    this.procedure.values['tissueThawingRows'].push({
      date: this.today(),
      time: '',
      vialsThawed: '',
      piecesThawed: '',
      viablePieces: '',
      viabilityPercentage: '',
      remainingPieces: '',
      embryologist: '',
      witness: '',
      notes: ''
    });
  }

  removeTissueThawingRow(index: number): void {
    this.procedure.values['tissueThawingRows'].splice(index, 1);
  }

  normalizeTissuePieces(): void {
    this.procedure.values['tissuePieces'] =
      this.procedure.values['tissuePieces'].map((row: any) => ({
        tissueType: row.tissueType ?? '',
        size: row.size ?? '',
        pieceNo: row.pieceNo ?? '',
        quality: row.quality ?? row.morphology ?? '',
        color: row.color ?? ''
      }));
  }

  normalizeTissueThawingRows(): void {
    this.procedure.values['tissueThawingRows'] =
      this.procedure.values['tissueThawingRows'].map((row: any) => ({
        date: row.date ?? '',
        time: row.time ?? '',
        vialsThawed: row.vialsThawed ?? '',
        piecesThawed: row.piecesThawed ?? '',
        viablePieces: row.viablePieces ?? '',
        viabilityPercentage: row.viabilityPercentage ?? row.viability ?? '',
        remainingPieces: row.remainingPieces ?? '',
        embryologist: row.embryologist ?? '',
        witness: row.witness ?? '',
        notes: row.notes ?? ''
      }));
  }

  today(): string {
    return new Date().toISOString().split('T')[0];
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}