import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-sperm-freezing',
  imports: [FormsModule, CommonModule],
  templateUrl: './sperm-freezing.html',
  styleUrl: './sperm-freezing.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class SpermFreezing {
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

    if (!Array.isArray(this.procedure.values['spermThawingRows'])) {
      this.procedure.values['spermThawingRows'] = [...this.spermThawingRows];
    }

    this.initDefaultValues();
    this.normalizeThawingRows();
  }

  spermThawingRows: any[] = [
    {
      thawingDate: '',
      thawingTime: '',
      ampoulesThawed: '',
      ampoulesSample: '',
      goodQualitySample: '',
      spermQuality: '',
      remainingAmpoules: '',
      embryologist: '',
      witness: '',
      notes: ''
    }
  ];

  initDefaultValues(): void {
    this.procedure.values['totalAmpoulesFrozen'] ??= '';
    this.procedure.values['dewar'] ??= '';
    this.procedure.values['numberOfStraws'] ??= '';
    this.procedure.values['strawColors'] ??= '';
    this.procedure.values['cassetteCanNo'] ??= '';
    this.procedure.values['canisterNo'] ??= '';
    this.procedure.values['freezingDate'] ??= '';
    this.procedure.values['freezingWitness'] ??= '';

    this.procedure.values['spermSource'] ??= '';

    this.procedure.values['firstSampleCount'] ??= '';
    this.procedure.values['firstSampleMotility'] ??= '';
    this.procedure.values['firstSampleMorphology'] ??= '';

    this.procedure.values['secondSampleCount'] ??= '';
    this.procedure.values['secondSampleMotility'] ??= '';
    this.procedure.values['secondSampleMorphology'] ??= '';

    this.procedure.values['thirdSampleCount'] ??= '';
    this.procedure.values['thirdSampleMotility'] ??= '';
    this.procedure.values['thirdSampleMorphology'] ??= '';
  }

  addThawingRow(): void {
    this.procedure.values['thawingRows'].push({
      thawingDate: this.today(),
      thawingTime: '',
      ampoulesThawed: '',
      ampoulesSample: '',
      goodQualitySample: '',
      spermQuality: '',
      remainingAmpoules: '',
      embryologist: '',
      witness: '',
      notes: ''
    });
  }

  removeThawingRow(index: number): void {
    this.procedure.values['thawingRows'].splice(index, 1);
  }

  normalizeThawingRows(): void {
    this.procedure.values['thawingRows'] =
      this.procedure.values['thawingRows'].map((row: any) => ({
        thawingDate: row.thawingDate ?? '',
        thawingTime: row.thawingTime ?? row.thawinTime ?? '',
        ampoulesThawed: row.ampoulesThawed ?? row.thawedAmpoules ?? '',
        ampoulesSample: row.ampoulesSample ?? '',
        goodQualitySample: row.goodQualitySample ?? '',
        spermQuality: row.spermQuality ?? '',
        remainingAmpoules: row.remainingAmpoules ?? '',
        embryologist: row.embryologist ?? row.thawedBy ?? '',
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