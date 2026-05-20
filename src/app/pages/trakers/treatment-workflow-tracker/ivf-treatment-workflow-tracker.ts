import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Patient } from '../../../models/patient';
import { Treatment } from '../../../models/treatment';
import { PatientService } from '../../../core/services/patient-service';
import { TreatmentService } from '../../../core/services/treatment-service';
import { SocketService } from '../../../core/services/socket-service';

@Component({
  selector: 'app-treatment-workflow-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ivf-treatment-workflow-tracker.html',
  styleUrl: './ivf-treatment-workflow-tracker.css',
})
export class IVFTreatmentWorkflowTracker implements OnInit, OnDestroy {

  @ViewChild('createTemplate')
  createModal!: TemplateRef<any>;

  private patientService = inject(PatientService);
  private treatmentService = inject(TreatmentService);
  private socketService = inject(SocketService);
  private modalService = inject(NgbModal);

  currentModalRef!: NgbModalRef;

  patientForSearch: Patient = this.newPatient();
  patients = signal<any[]>([]);

  freshETCycles = signal<Treatment[]>([]);
  frozenETCycles = signal<Treatment[]>([]);
  opuOnlyCycles = signal<Treatment[]>([]);

  async ngOnInit() {
    await this.loadCycles();

    this.socketService.connect((treatment: Treatment) => {
      if (treatment.isDeleted) {

        this.removeCycleFromAllArrays(treatment.id);
      }

      else {

        this.removeCycleFromAllArrays(treatment.id);

        this.addCycleToCorrectArray(treatment);
      }
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  async loadCycles() {
    const data = await this.treatmentService.get(this.newTreatment());

    this.freshETCycles.set([]);
    this.frozenETCycles.set([]);
    this.opuOnlyCycles.set([]);

    data.forEach(treatment => {
      this.addCycleToCorrectArray(treatment);
    });
  }

  async searchForPatients() {
    const data = await this.patientService.get(this.patientForSearch);
    this.patients.set(data);
  }

  reset() {
    this.patientForSearch = this.newPatient();
    this.patients.set([])
  }

  openCreateModal() {
    this.open(this.createModal, 'xl');
  }

  async createCycleFromPatient(patient: any) {
    const treatment: Treatment = {
      id: '',
      type: patient.selectedTreatmentType,
      values: this.buildInitialValues(patient.selectedTreatmentType),
      patient: patient,
      createdDate: '',
      modifiedDate: '',
      isDeleted: false
    };

    const saved = await this.treatmentService.add(treatment);

    if (saved) {
      this.closeModal();
    }
  }

  async toggleStep(cycle: Treatment, key: string) {
    cycle.values[key] = !cycle.values[key];

    await this.treatmentService.update(cycle);
  }

  async deleteCycle(cycle: Treatment) {
    const deleted = await this.treatmentService.delete(cycle);

    if (deleted) {
      this.removeCycleFromAllArrays(cycle.id);
    }
  }

  addCycleToCorrectArray(cycle: Treatment) {

    let temp: Treatment[] = [];

    if (cycle.type === 'Fresh ET') {

      temp = [...this.freshETCycles()];

      temp.push({ ...cycle });

      this.freshETCycles.set(temp);
    }

    else if (cycle.type === 'Frozen ET') {

      temp = [...this.frozenETCycles()];

      temp.push({ ...cycle });

      this.frozenETCycles.set(temp);
    }

    else if (cycle.type === 'OPU Only') {

      temp = [...this.opuOnlyCycles()];

      temp.push({ ...cycle });

      this.opuOnlyCycles.set(temp);
    }
  }

  removeCycleFromAllArrays(id: any) {

    let temp: Treatment[] = [];
    let filtered: Treatment[] = [];

    temp = [...this.freshETCycles()];

    for (let i = 0; i < temp.length; i++) {

      if (temp[i].id !== id) {

        filtered.push(temp[i]);
      }
    }

    this.freshETCycles.set(filtered);

    temp = [...this.frozenETCycles()];
    filtered = [];

    for (let i = 0; i < temp.length; i++) {

      if (temp[i].id !== id) {

        filtered.push(temp[i]);
      }
    }

    this.frozenETCycles.set(filtered);

    temp = [...this.opuOnlyCycles()];
    filtered = [];

    for (let i = 0; i < temp.length; i++) {

      if (temp[i].id !== id) {

        filtered.push(temp[i]);
      }
    }

    this.opuOnlyCycles.set(filtered);
  }

  buildInitialValues(type: string): any {
    const values: any = {
      receptionDone: false,
      preOpDone: false,
      recoveryDone: false,
      dischargedDone: false
    };

    if (type === 'Fresh ET') {
      values.orEtDone = false;
      values.labReadyDone = false;
    }

    if (type === 'Frozen ET') {
      values.orEtDone = false;
      values.embryoThawedDone = false;
      values.readyForEtDone = false;
    }

    if (type === 'OPU Only') {
      values.opuDone = false;
      values.semenReceptionDone = false;
      values.collectionRoomDone = false;
      values.labPreparationDone = false;
      values.readyDone = false;
      values.usedCryoDone = false;
    }

    return values;
  }

  open(content: TemplateRef<any>, size: string) {
    this.currentModalRef = this.modalService.open(content, {
      size: size,
      ariaLabelledBy: 'modal-basic-title'
    });
  }

  closeModal() {
    this.currentModalRef.close();
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

  newTreatment(): Treatment {
    return {
      id: '',
      type: '',
      values: {},
      patient: this.newPatient(),
      createdDate: '',
      modifiedDate: '',
      isDeleted: false
    };
  }
}