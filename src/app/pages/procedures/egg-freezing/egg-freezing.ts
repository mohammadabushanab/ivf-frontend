import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { NumbersOnly } from '../../../shared/directives/numbers-only';
import { TextOnly } from '../../../shared/directives/text-only';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-egg-freezing',
  imports: [FormsModule, CommonModule, NumbersOnly, TextOnly],
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

    if (!this.procedure.values['oocyteRows']) {
      this.procedure.values['oocyteRows'] = [...this.oocyteRows];
    }

    if (!this.procedure.values['thawingRows']) {
      this.procedure.values['thawingRows'] = [...this.thawingRows];
    }

    if (!this.procedure.values['fertilizationRows']) {
      this.procedure.values['fertilizationRows'] = [...this.fertilizationRows];
    }

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
      survived: '',
      survival: '',
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
      maturity: '',
      grade: '',
      notes: ''
    });
    this.updateTotalEggsFrozen();
  }

  removeOocyteRow(index: number): void {
    this.procedure.values['oocyteRows'].splice(index, 1);

    this.updateTotalEggsFrozen();
  }

  updateTotalEggsFrozen(): void {
    this.procedure.values['totalEggsFrozen'] = this.procedure.values['oocyteRows'].length;
  }

  addThawingRow(): void {
    this.procedure.values['thawingRows'].push({
      date: this.today(),
      straws: 0,
      oocytes: 0,
      survived: 0,
      survival: '0%',
      embryologist: 'JACOUB ETWAN',
      witness: 'JACOUB ETWAN',
      notes: ''
    });
  }

  removeThawingRow(index: number): void {
    this.procedure.values['thawingRows'].splice(index, 1);
  }

  addFertilizationRow(): void {
    this.procedure.values['fertilizationRows'].push({
      date: this.today(),
      oocytesUsed: 0,
      fertMethod: 'ICSI',
      twoPnFormed: 0,
      embryos: 0,
      embryologist: 'JACOUB ETWAN',
      witness: 'JACOUB ETWAN',
      notes: ''
    });
  }

  removeFertilizationRow(index: number): void {
    this.procedure.values['fertilizationRows'].splice(index, 1);
  }

  today(): string {
    return new Date().toISOString().split('T')[0];
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
