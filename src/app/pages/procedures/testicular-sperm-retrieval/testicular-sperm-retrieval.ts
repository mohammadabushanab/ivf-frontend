import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { NumbersOnly } from '../../../shared/directives/numbers-only';
import { TextOnly } from '../../../shared/directives/text-only';
import { User } from '../../../models/user';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-testicular-sperm-retrieval',
  imports: [FormsModule, CommonModule, NumbersOnly, TextOnly],
  templateUrl: './testicular-sperm-retrieval.html',
  styleUrl: './testicular-sperm-retrieval.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class TesticularSpermRetrieval {
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
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
