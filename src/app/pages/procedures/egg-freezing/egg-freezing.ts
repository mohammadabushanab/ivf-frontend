import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-egg-freezing',
  imports: [FormsModule, CommonModule],
  templateUrl: './egg-freezing.html',
  styleUrl: './egg-freezing.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class EggFreezing {
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

    if (!Array.isArray(this.procedure.values['oocyteRows'])) {
      this.procedure.values['oocyteRows'] = [...this.oocyteRows];
    }

    if (!Array.isArray(this.procedure.values['thawingRows'])) {
      this.procedure.values['thawingRows'] = [...this.thawingRows];
    }

    if (!Array.isArray(this.procedure.values['fertilizationRows'])) {
      this.procedure.values['fertilizationRows'] = [...this.fertilizationRows];
    }

    this.normalizeOocyteRows();
    this.normalizeThawingRows();
    this.normalizeFertilizationRows();

    this.updateTotalEggsFrozen();
  }

  oocyteRows: any[] = [
    {
      stage: '',
      quality: ''
    }
  ];

  thawingRows: any[] = [
    {
      date: '',
      time: '',
      straws: '',
      oocytes: '',
      survivedOocytes: '',
      survivalPercentage: '',
      remainingOocytes: '',
      embryologist: '',
      witness: '',
      notes: ''
    }
  ];

  fertilizationRows: any[] = [
    {
      date: '',
      time: '',
      oocytesUsed: '',
      fertMethod: '',
      twoPnFormed: '',
      embryos: '',
      embryologist: '',
      witness: '',
      notes: ''
    }
  ];

  addOocyteRow(): void {
    this.procedure.values['oocyteRows'].push({
      stage: '',
      quality: ''
    });

    this.updateTotalEggsFrozen();
  }

  removeOocyteRow(index: number): void {
    this.procedure.values['oocyteRows'].splice(index, 1);
    this.updateTotalEggsFrozen();
  }

  addThawingRow(): void {
    this.procedure.values['thawingRows'].push({
      date: this.today(),
      time: '',
      straws: '',
      oocytes: '',
      survivedOocytes: '',
      survivalPercentage: '',
      remainingOocytes: '',
      embryologist: '',
      witness: '',
      notes: ''
    });
  }

  removeThawingRow(index: number): void {
    this.procedure.values['thawingRows'].splice(index, 1);
  }

  addFertilizationRow(): void {
    this.procedure.values['fertilizationRows'].push({
      date: this.today(),
      time: '',
      oocytesUsed: '',
      fertMethod: 'ICSI',
      twoPnFormed: '',
      embryos: '',
      embryologist: '',
      witness: '',
      notes: ''
    });
  }

  removeFertilizationRow(index: number): void {
    this.procedure.values['fertilizationRows'].splice(index, 1);
  }

  updateTotalEggsFrozen(): void {
    this.procedure.values['totalEggsFrozen'] =
      this.procedure.values['oocyteRows']?.length || 0;
  }

  normalizeOocyteRows(): void {
    this.procedure.values['oocyteRows'] =
      this.procedure.values['oocyteRows'].map((row: any) => ({
        stage: row.stage ?? row.maturity ?? '',
        quality: row.quality ?? row.grade ?? ''
      }));
  }

  normalizeThawingRows(): void {
    this.procedure.values['thawingRows'] =
      this.procedure.values['thawingRows'].map((row: any) => ({
        date: row.date ?? '',
        time: row.time ?? '',
        straws: row.straws ?? '',
        oocytes: row.oocytes ?? '',
        survivedOocytes: row.survivedOocytes ?? row.survived ?? '',
        survivalPercentage: row.survivalPercentage ?? row.survival ?? '',
        remainingOocytes: row.remainingOocytes ?? '',
        embryologist: row.embryologist ?? '',
        witness: row.witness ?? '',
        notes: row.notes ?? ''
      }));
  }

  normalizeFertilizationRows(): void {
    this.procedure.values['fertilizationRows'] =
      this.procedure.values['fertilizationRows'].map((row: any) => ({
        date: row.date ?? '',
        time: row.time ?? '',
        oocytesUsed: row.oocytesUsed ?? '',
        fertMethod: row.fertMethod ?? '',
        twoPnFormed: row.twoPnFormed ?? '',
        embryos: row.embryos ?? '',
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