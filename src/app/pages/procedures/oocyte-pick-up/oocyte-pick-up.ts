import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-oocyte-pick-up',
  imports: [FormsModule, CommonModule],
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

  embryologists = signal<User[]>([]);

  physicians = signal<User[]>([]);

  isOocyteSectionOpen = false;
  isEmbryoSectionOpen = false;

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

    const data1 = await this.userService.getUsersByRole(searchCriteria);
    this.embryologists.set(data1);

    searchCriteria = {
      id: '',
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'Physician',
      token: '',
      isLoggedIn: false,
      newPassword: ''
    };

    const data2 = await this.userService.getUsersByRole(searchCriteria);
    this.physicians.set(data2);

    if (!this.procedure.values || typeof this.procedure.values !== 'object') {
      this.procedure.values = {};
    }

    if (!Array.isArray(this.procedure.values['oocyteRows'])) {
      this.procedure.values['oocyteRows'] = [...this.oocyteRows];
    }

    if (!Array.isArray(this.procedure.values['oocyteThawingRows'])) {
      this.procedure.values['oocyteThawingRows'] = [...this.oocyteThawingRows];
    }

    if (!Array.isArray(this.procedure.values['oocyteFertilizationRows'])) {
      this.procedure.values['oocyteFertilizationRows'] = [...this.oocyteFertilizationRows];
    }

    this.normalizeOocyteRows();
    this.normalizeThawingRows();
    this.normalizeFertilizationRows();

    this.updateTotalEggsFrozen();


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

  oocyteRows: any[] = [
    {
      stage: '',
      quality: ''
    }
  ];

  oocyteThawingRows: any[] = [
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

  oocyteFertilizationRows: any[] = [
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
