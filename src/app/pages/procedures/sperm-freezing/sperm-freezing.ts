import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { NumbersOnly } from '../../../shared/directives/numbers-only';
import { TextOnly } from '../../../shared/directives/text-only';
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

    if (!this.procedure.values['freezingRows']) {
      this.procedure.values['freezingRows'] = [...this.freezingRows];
    }

    if (!this.procedure.values['thawingRows']) {
      this.procedure.values['thawingRows'] = [...this.thawingRows];
    }

  }

  freezingRows: any[] = [
    {
      ampoules: '',
      id: '',
      dewar: '',
      canister: '',
      freezingDate: ''
    }
  ];

  thawingRows: any[] = [
    {
      thawingDate: '',
      thawinTime: '',
      thawedAmpoules: '',
      spermQuality: '',
      remainingAmpoules: '',
      thawedBy: '',
      witness: ''
    }
  ];

  addFreezingRow(): void {
    this.procedure.values['freezingRows'].push({
      ampoules: '',
      id: '',
      dewar: '',
      canister: '',
      freezingDate: ''
    });
  }

  removeFreezingRow(index: number): void {
    this.procedure.values['freezingRows'].splice(index, 1);
  }

  addThawingRow(): void {
    this.procedure.values['thawingRows'].push({
      thawingDate: '',
      thawedAmpoules: '',
      spermQuality: '',
      remainingAmpoules: '',
      thawedBy: '',
      witness: ''
    });

  }

  removeThawingRow(index: number): void {
    this.procedure.values['thawingRows'].splice(index, 1);

  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
