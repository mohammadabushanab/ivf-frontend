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
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }


}
