import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-embryo-freezing',
  imports: [FormsModule, CommonModule],
  templateUrl: './embryo-freezing.html',
  styleUrl: './embryo-freezing.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class EmbryoFreezing {
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

    if (!Array.isArray(this.procedure.values['embryoRows'])) {
      this.procedure.values['embryoRows'] = [...this.embryoRows];
    }

    if (!Array.isArray(this.procedure.values['embryoThawingRows'])) {
      this.procedure.values['embryoThawingRows'] = [...this.embryoThawingRows];
    }

    if (!Array.isArray(this.procedure.values['embryoTransferRows'])) {
      this.procedure.values['embryoTransferRows'] = [...this.embryoTransferRows];
    }

    this.normalizeEmbryoRows();
    this.normalizeEmbryoThawingRows();
    this.normalizeEmbryoTransferRows();

    this.updateTotalEmbroyosFrozen();
  }

  embryoRows: any[] = [
    {
      stage: '',
      quality1: '',
      quality2: ''
    }
  ];

  embryoThawingRows: any[] = [
    {
      date: '',
      time: '',
      straws: '',
      embryos: '',
      survivedEmbryos: '',
      survivalPercentage: '',
      remainingEmbryos: '',
      embryologist: '',
      witness: '',
      notes: ''
    }
  ];

  embryoTransferRows: any[] = [
    {
      date: '',
      time: '',
      catheter: '',
      embryos: '',
      status: '',
      difficulties: '',
      embryologist: '',
      witness: '',
      notes: ''
    }
  ];

  addEmbryoRow(): void {
    this.procedure.values['embryoRows'].push({
      stage: '',
      quality1: '',
      quality2: ''
    });

    this.updateTotalEmbroyosFrozen();
  }

  removeEmbryoRow(index: number): void {
    this.procedure.values['embryoRows'].splice(index, 1);
    this.updateTotalEmbroyosFrozen();
  }

  updateTotalEmbroyosFrozen(): void {
    this.procedure.values['numberOfEmbryos'] =
      this.procedure.values['embryoRows']?.length || 0;
  }

  addEmbryoThawingRow(): void {
    this.procedure.values['embryoThawingRows'].push({
      date: this.today(),
      time: '',
      straws: '',
      embryos: '',
      survivedEmbryos: '',
      survivalPercentage: '',
      remainingEmbryos: '',
      embryologist: '',
      witness: '',
      notes: ''
    });
  }

  removeEmbryoThawingRow(index: number): void {
    this.procedure.values['embryoThawingRows'].splice(index, 1);
  }

  addEmbryoTransferRow(): void {
    this.procedure.values['embryoTransferRows'].push({
      date: this.today(),
      time: '',
      catheter: '',
      embryos: '',
      status: '',
      difficulties: '',
      embryologist: '',
      witness: '',
      notes: ''
    });
  }

  removeEmbryoTransferRow(index: number): void {
    this.procedure.values['embryoTransferRows'].splice(index, 1);
  }

  normalizeEmbryoRows(): void {
    this.procedure.values['embryoRows'] =
      this.procedure.values['embryoRows'].map((row: any) => ({
        stage: row.stage ?? '',
        quality1: row.quality1 ?? row.quality ?? '',
        quality2: row.quality2 ?? ''
      }));
  }

  normalizeEmbryoThawingRows(): void {
    this.procedure.values['embryoThawingRows'] =
      this.procedure.values['embryoThawingRows'].map((row: any) => ({
        date: row.date ?? '',
        time: row.time ?? '',
        straws: row.straws ?? row.strawsThawed ?? '',
        embryos: row.embryos ?? '',
        survivedEmbryos: row.survivedEmbryos ?? row.survived ?? '',
        survivalPercentage: row.survivalPercentage ?? row.survival ?? '',
        remainingEmbryos: row.remainingEmbryos ?? row.remaining ?? '',
        embryologist: row.embryologist ?? '',
        witness: row.witness ?? '',
        notes: row.notes ?? ''
      }));
  }

  normalizeEmbryoTransferRows(): void {
    this.procedure.values['embryoTransferRows'] =
      this.procedure.values['embryoTransferRows'].map((row: any) => ({
        date: row.date ?? '',
        time: row.time ?? '',
        catheter: row.catheter ?? '',
        embryos: row.embryos ?? '',
        status: row.status ?? '',
        difficulties: row.difficulties ?? '',
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