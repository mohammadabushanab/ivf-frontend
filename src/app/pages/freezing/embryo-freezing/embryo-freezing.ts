import { Component, inject, signal } from '@angular/core';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../core/services/patient-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Freezing } from '../../../models/Freezing';
import { FreezingService } from '../../../core/services/freezing-service';

@Component({
  selector: 'app-embryo-freezing',
  imports: [CommonModule, FormsModule],
  templateUrl: './embryo-freezing.html',
  styleUrl: './embryo-freezing.css',
})
export class EmbryoFreezing {

  private freezingService = inject(FreezingService);

  patientForSearch: Patient = this.newPatient();
  freezingForSearch: Freezing = this.newFreezing();
  patients = signal<Patient[]>([]);
  embryos = signal<Freezing[]>([]);
  totalRecords = signal<number>(0);
  remaining = signal<number>(0);
  zeroRemaining = signal<number>(0);
  withMobile = signal<number>(0);

  async ngOnInit(): Promise<void> {
    let freezing: Freezing = this.newFreezing();
    freezing.type = 'EMBRYO';

    const data = await this.freezingService.getBySearchCriteria(freezing);

    if (data != null) {
      this.embryos.set(data);

      let remaining = 0;
      for (let items of data) {
        if (items.remaining != null) {
          remaining += Number(items.remaining);
        }
      }
      this.remaining.set(remaining);

      let zeroRemainingCount = 0;
      for (let items of data) {
        if (items.remaining != null && items.remaining === 0) {
          zeroRemainingCount++;
        }
      }
      this.zeroRemaining.set(zeroRemainingCount);

      let withMobileCount = 0;
      for (let items of data) {
        if (items.patient != null) {
          if (items.patient.phoneNumber != null) {
            if (items.patient.phoneNumber.trim() !== '') {
              withMobileCount++;
            }
          }
        }
      }
      this.withMobile.set(withMobileCount);
    }

  }

  async searchForFreezing() {
    this.freezingForSearch.patient = { ... this.patientForSearch }
    this.freezingForSearch.type = 'EMBRYO';
    const data = await this.freezingService.getBySearchCriteria(this.freezingForSearch);
    if (data != null) {
      this.embryos.set(data);
    }
  }

  reset() {
    this.patientForSearch = this.newPatient();
    this.freezingForSearch = this.newFreezing();
    this.embryos.set([]);
  }

  newFreezing(): Freezing {
    return {
      frozenEmbryos: 0,
      frozenEggs: 0,
      frozenSpermAmpoules: 0,
      totalFreezingItems: 0,
      id: 0,
      type: '',
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
