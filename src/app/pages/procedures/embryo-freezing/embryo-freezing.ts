import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { NumbersOnly } from '../../../shared/directives/numbers-only';
import { TextOnly } from '../../../shared/directives/text-only';
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

    if (!this.procedure.values['embryoRows']) {
      this.procedure.values['embryoRows'] = [...this.embryoRows];
    }

    if (!this.procedure.values['embryoThawingRows']) {
      this.procedure.values['embryoThawingRows'] = [...this.embryoThawingRows];
    }

    if (!this.procedure.values['embryoTransferRows']) {
      this.procedure.values['embryoTransferRows'] = [...this.embryoTransferRows];
    }

    this.initEmbryoFreezingValues();
  }

  embryoRows: any[] = [
    {
      stage: '',
      quality: ''
    }
  ];

  embryoThawingRows: any[] = [
    {
      date: '',
      straws: '',
      oocytes: '',
      survived: '',
      survival: '',
      embryologist: '',
      witness: '',
      notes: ''
    }
  ];

  embryoTransferRows: any[] = [
    {
      date: '',
      oocytesUsed: '',
      fertMethod: '',
      twoPnFormed: '',
      embryos: '',
      embryologist: '',
      witness: '',
      notes: ''
    }
  ];

  initEmbryoFreezingValues(): void {
    this.updateTotalEmbroyosFrozen();
  }

  addEmbryoRow(): void {
    this.procedure.values['embryoRows'].push({
      stage: '',
      quality: '',
      notes: ''
    });

    this.updateTotalEmbroyosFrozen();
  }

  removeEmbryoRow(index: number): void {

    this.procedure.values['embryoRows'].splice(index, 1);

    this.updateTotalEmbroyosFrozen();


  }

  updateTotalEmbroyosFrozen(): void {
    this.procedure.values['numberOfEmbryos'] = this.procedure.values['embryoRows'].length;
  }

  addEmbryoThawingRow(): void {
    this.procedure.values['embryoThawingRows'].push({
      date: this.today(),
      time: '08:00',
      strawsThawed: '',
      embryos: '',
      survived: '',
      remaining: '',
      straws: '',
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
      time: '11:00',
      catheter: '',
      embryos: '',
      status: '',
      difficulties: '',
      embryologist: '',
      witness: ''
    });
  }

  removeEmbryoTransferRow(index: number): void {
    this.procedure.values['embryoTransferRows'].splice(index, 1);
  }

  today(): string {
    return new Date().toISOString().split('T')[0];
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
