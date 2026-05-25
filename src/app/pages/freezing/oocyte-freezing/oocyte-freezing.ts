import { Component, inject, signal } from '@angular/core';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../core/services/patient-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Freezing } from '../../../models/Freezing';
import { FreezingService } from '../../../core/services/freezing-service';

@Component({
  selector: 'app-oocyte-freezing',
  imports: [CommonModule, FormsModule],
  templateUrl: './oocyte-freezing.html',
  styleUrl: './oocyte-freezing.css',
})
export class OocyteFreezing {

  patients = signal<Patient[]>([]);
  eggs = signal<Freezing[]>([]);
  totalRecords = signal<number>(0);
  remaining = signal<number>(0);
  zeroRemaining = signal<number>(0);
  withMobile = signal<number>(0);

  patientForSearch: Patient = this.newPatient();
  freezingForSearch: Freezing = this.newFreezing();

  private freezingService = inject(FreezingService);


  async ngOnInit(): Promise<void> {
    let freezing: Freezing = this.newFreezing();
    freezing.type = 'EGG';
    const data = await this.freezingService.getBySearchCriteria(freezing);

    if (data != null) {
      this.eggs.set(data);

      let remaining = 0;
      for (let items of data) {
        if (items.remaining != null) {
          remaining = remaining + Number(items.remaining);
        }
      }
      this.remaining.set(remaining);

      let zeroRemainingCount = 0;
      for (let items of data) {
        if (items.remaining != null && items.remaining === 0) {
          zeroRemainingCount = zeroRemainingCount + 1;
        }
      }
      this.zeroRemaining.set(zeroRemainingCount);

      let withMobileCount = 0;
      for (let items of data) {
        if (items.patient != null) {
          if (items.patient.phoneNumber != null) {
            if (items.patient.phoneNumber.trim() !== '') {
              withMobileCount = withMobileCount + 1
            }
          }
        }
      }
      this.withMobile.set(withMobileCount);
    }

  }

  async searchForFreezing() {
    this.freezingForSearch.patient = { ... this.patientForSearch }
    this.freezingForSearch.type = 'EGG';
    const data = await this.freezingService.getBySearchCriteria(this.freezingForSearch);
    if (data != null) {
      this.eggs.set(data);
    }
  }

  reset() {
    this.patientForSearch = this.newPatient();
    this.freezingForSearch = this.newFreezing();
    this.eggs.set([]);
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
