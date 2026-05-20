import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth-service';
import { ProcedureService } from '../../core/services/procedure-service';
import { PatientService } from '../../core/services/patient-service';
import { Freezing } from '../../models/Freezing';
import { FreezingService } from '../../core/services/freezing-service';
import { ProceduresCount } from '../../models/procedures-count';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {


  proceduresCount = signal<ProceduresCount[] | null>(null);
  totalProcedures = signal<number>(0);
  totalPatients = signal<number>(0);
  frozenEmbryos = signal<number>(0);
  frozenEggs = signal<number>(0);
  frozenSpermAmpoules = signal<number>(0);
  totalFreezingItems = signal<number>(0);

  private freezingService = inject(FreezingService);
  private procedureService = inject(ProcedureService);
  private patientService = inject(PatientService);
  private authService = inject(AuthService);

  currentUser = this.authService.getUser();

  async ngOnInit(): Promise<void> {
    let freezing: Freezing = this.newFreezing();
    freezing.type = 'EMBRYO';


    const data1 = await this.freezingService.getTotalByType(freezing);
    this.frozenEmbryos.set(data1);

    freezing = this.newFreezing();
    freezing.type = 'EGG';

    const data2 = await this.freezingService.getTotalByType(freezing);
    this.frozenEggs.set(data2);

    freezing = this.newFreezing();
    freezing.type = 'SPERM';

    const data3 = await this.freezingService.getTotalByType(freezing);
    this.frozenSpermAmpoules.set(data3);

    const data4 = await this.procedureService.getProceduresCountByType();
    this.proceduresCount.set(data4);

    const data5 = await this.procedureService.getTotal();
    this.totalProcedures.set(data5);

    const data6 = await this.patientService.getTotal();
    this.totalPatients.set(data6);

    let total = this.frozenEmbryos() + this.frozenEggs() + this.frozenSpermAmpoules();

    this.totalFreezingItems.set(total);
  }

  newFreezing(): Freezing {
    return {
      frozenEmbryos: 0,
      frozenEggs: 0,
      frozenSpermAmpoules: 0,
      totalFreezingItems: 0,
      id: 0,
      type: 'EMBRYO',
      total: 0,
      remaining: 0,
      dewar: '',
      canister: '',
      notes: '',
      date: '',
      patient: {
        id: '',
        nationalId: '',
        name: '',
        phoneNumber: '',
        age: '',
        husbandNationalId: '',
        husbandName: '',
        husbandPhoneNumber: '',
        selectedTreatmentType: '',
        createdDate: '',
        modifiedDate: '',
        fromDate: '',
        toDate: ''
      }

    };
  }
}
