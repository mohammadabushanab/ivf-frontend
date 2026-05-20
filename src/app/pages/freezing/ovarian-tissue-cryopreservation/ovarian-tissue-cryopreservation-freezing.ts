import { Component, inject, signal } from '@angular/core';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../core/services/patient-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Freezing } from '../../../models/Freezing';
import { FreezingService } from '../../../core/services/freezing-service';

@Component({
  selector: 'app-ovarian-tissue-cryopreservation',
  imports: [CommonModule, FormsModule],
  templateUrl: './ovarian-tissue-cryopreservation-freezing.html',
  styleUrl: './ovarian-tissue-cryopreservation-freezing.css',
})
export class OvarianTissueCryopreservationFreezing {

  private patientService = inject(PatientService);
  private freezingService = inject(FreezingService);

  patientForSearch: Patient = this.newPatient();
  patients = signal<Patient[]>([]);
  tissues = signal<Freezing[]>([]);

  async ngOnInit(): Promise<void> {
    let freezing: Freezing = this.newFreezing();
    freezing.type = 'EMBRYO';

    const data = await this.freezingService.getBySearchCriteria(freezing);

    if (data != null) {
      this.tissues.set(data);
    }

  }

  async searchForPatients() {
    const data = await this.patientService.get(this.patientForSearch);
    this.patients.set(data);
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

  newPatient(): Patient {
    return {
      id: '',
      name: '',
      phoneNumber: '',
      nationalId: '',
      age: '',
      husbandName: '',
      husbandNationalId: '',
      husbandPhoneNumber: '',
      selectedTreatmentType: '',
      createdDate: '',
      modifiedDate: '',
      fromDate: '',
      toDate: ''
    };
  }

}
