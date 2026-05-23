import { Component, inject, Input, signal } from '@angular/core';
import { Procedure } from '../../../models/procedure';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { NumbersOnly } from '../../../shared/directives/numbers-only';
import { TextOnly } from '../../../shared/directives/text-only';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-semen-preparation-for-iui',
  imports: [FormsModule, CommonModule],
  templateUrl: './semen-preparation-for-iui.html',
  styleUrl: './semen-preparation-for-iui.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class SemenPreparationForIui {
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

  generate(values: any): void {
    const sperm = this.toNumber(values['spermCountMillionMl']);
    const motility = this.toNumber(values['totalMotility']);
    const progressiveMotility = this.toNumber(values['progressiveMotility']);
    const morphology = this.toNumber(values['normalMorphology']);
    const volume = this.toNumber(values['volume']);

    let text = '🔬 SEMEN ANALYSIS REPORT\n\n';

    text += sperm >= 16
      ? '✅ Sperm count: NORMAL (≥16 million/mL)\n'
      : sperm > 0
        ? '⚠️ Sperm count: LOW - Oligozoospermia\n'
        : '❌ Sperm count: AZOOSPERMIA - No sperm detected\n';

    text += motility >= 42
      ? '✅ Total motility: NORMAL (≥42%)\n'
      : motility > 0
        ? '⚠️ Total motility: LOW - Asthenozoospermia\n'
        : '❌ Total motility: IMMOTILE - Complete immotility\n';

    text += progressiveMotility >= 30
      ? '✅ Progressive motility: NORMAL (≥30%)\n'
      : progressiveMotility > 0
        ? '⚠️ Progressive motility: BELOW NORMAL\n'
        : '❌ Progressive motility: NONE\n';

    text += morphology >= 4
      ? '✅ Morphology: NORMAL (≥4% normal forms)\n'
      : morphology > 0
        ? '⚠️ Morphology: ABNORMAL - Teratozoospermia\n'
        : '❌ Morphology: SEVERE TERATOZOOSPERMIA\n';

    text += volume >= 1.4
      ? '✅ Volume: NORMAL (≥1.4 mL)\n'
      : volume > 0
        ? '⚠️ Volume: LOW - Hypospermia\n'
        : '❌ Volume: ASPERMIA - No ejaculate\n';

    const normalCount = [
      sperm >= 16,
      motility >= 42,
      progressiveMotility >= 30,
      morphology >= 4,
      volume >= 1.4
    ].filter(Boolean).length;

    text += '\n📊 OVERALL ASSESSMENT: ';

    if (normalCount === 5) {
      text += 'NORMOSPERMIA - All main parameters are within normal limits.';
    } else if (normalCount >= 3) {
      text += 'MILD TO MODERATE ABNORMALITY - Some parameters are outside the normal range. Clinical correlation is recommended.';
    } else {
      text += 'SIGNIFICANT ABNORMALITY - Multiple parameters are abnormal. Comprehensive andrological evaluation is recommended.';
    }

    values['aiInterpretation'] = text;
  }

  toNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    return Number(value) || 0;
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
