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
  templateUrl: './treatment-workflow-tracker.html',
  styleUrl: './treatment-workflow-tracker.css',
})
export class TreatmentWorkflowTracker implements OnInit, OnDestroy {

  @ViewChild('createTemplate')
  createModal!: TemplateRef<any>;

  private patientService = inject(PatientService);
  private treatmentService = inject(TreatmentService);
  private socketService = inject(SocketService);
  private modalService = inject(NgbModal);

  freshETTreatments = signal<Treatment[]>([]);
  frozenETTreatments = signal<Treatment[]>([]);
  opuOnlyTreatments = signal<Treatment[]>([]);
  patients = signal<any[]>([]);

  currentModalRef!: NgbModalRef;
  patientForSearch: Patient = this.newPatient();

  async ngOnInit() {
    await this.loadTreatments();

    this.socketService.connect((treatment: Treatment) => {
      if (treatment.isDeleted) {
        this.removeTreatmentFromAllArrays(treatment.id);
      } else {
        this.removeTreatmentFromAllArrays(treatment.id);
        this.addTreatmentToCorrectArray(treatment);
      }
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  async loadTreatments() {
    let treatment: Treatment = this.newTreatment();
    treatment.status = 'Done'
    const data = await this.treatmentService.get(treatment);

    this.freshETTreatments.set([]);
    this.frozenETTreatments.set([]);
    this.opuOnlyTreatments.set([]);

    for (let treatment of data) {
      this.addTreatmentToCorrectArray(treatment);
    }
  }

  async searchForPatients() {
    const data = await this.patientService.get(this.patientForSearch);
    this.patients.set(data);
  }

  reset() {
    this.patientForSearch = this.newPatient();
    this.patients.set([]);
  }

  openCreateModal() {
    this.open(this.createModal, 'xl');
  }

  async createTreatment(patient: Patient) {
    console.log(patient)
    let treatment: Treatment = this.newTreatment();

    treatment.patient = { ...patient };
    treatment.type = treatment.patient.selectedTreatmentType;
    treatment.values = this.buildInitialValues(treatment.type);
    treatment.status = 'Created';

    await this.treatmentService.add(treatment);

    this.closeModal();
  }

  async saveTreatment(treatment: Treatment) {
    treatment.status = 'Done';
    await this.treatmentService.update(treatment);

    this.removeTreatmentFromAllArrays(treatment.id);
  }

  async toggleStep(treatment: Treatment, key: string) {
    treatment.values[key] = !treatment.values[key];

    treatment.status = 'In Progresss';

    await this.treatmentService.update(treatment);
  }

  async deleteTreatment(treatment: Treatment) {
    const deleted = await this.treatmentService.delete(treatment);

    if (deleted) {
      this.removeTreatmentFromAllArrays(treatment.id);
    }
  }

  addTreatmentToCorrectArray(treatment: Treatment) {

    let temp: Treatment[] = [];

    if (treatment.type === 'Fresh ET') {

      temp = [...this.freshETTreatments()];
      temp.push({ ...treatment });
      this.freshETTreatments.set(temp);

    } else if (treatment.type === 'Frozen ET') {

      temp = [...this.frozenETTreatments()];
      temp.push({ ...treatment });
      this.frozenETTreatments.set(temp);

    } else if (treatment.type === 'OPU Only') {

      temp = [...this.opuOnlyTreatments()];
      temp.push({ ...treatment });
      this.opuOnlyTreatments.set(temp);

    }
  }

  removeTreatmentFromAllArrays(id: any) {

  let temp: Treatment[] = [...this.freshETTreatments()];

  for (let i = 0; i < temp.length; i++) {
    if (temp[i].id === id) {
      temp.splice(i, 1);
      break;
    }
  }

  this.freshETTreatments.set(temp);

  temp = [...this.frozenETTreatments()];

  for (let i = 0; i < temp.length; i++) {
    if (temp[i].id === id) {
      temp.splice(i, 1);
      break;
    }
  }

  this.frozenETTreatments.set(temp);

  temp = [...this.opuOnlyTreatments()];

  for (let i = 0; i < temp.length; i++) {
    if (temp[i].id === id) {
      temp.splice(i, 1);
      break;
    }
  }

  this.opuOnlyTreatments.set(temp);
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
      isDeleted: false,
      status: ''
    };
  }
}