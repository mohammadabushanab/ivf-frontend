import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Patient } from '../../../models/patient';
import { OPU } from '../../../models/opu';
import { PatientService } from '../../../core/services/patient-service';
import { SocketService } from '../../../core/services/socket-service';
import { OPUService } from '../../../core/services/opu-service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-opu-live-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opu-live-tracker.html',
  styleUrl: './opu-live-tracker.css',
})
export class OPULiveTracker implements OnInit, OnDestroy {

  @ViewChild('createTemplate')
  createModal!: TemplateRef<any>;

  private patientService = inject(PatientService);
  private opuService = inject(OPUService);
  private socketService = inject(SocketService);
  private modalService = inject(NgbModal);

  currentModalRef!: NgbModalRef;

  patientForSearch: Patient = this.newPatient();

  patients = signal<any[]>([]);
  opuSessions = signal<OPU[]>([]);

  async ngOnInit() {
    await this.loadOPUSessions();

    this.socketService.connect(undefined, (opu: OPU) => {

      if (opu.isDeleted) {
        this.removeOPUFromArray(opu.id);
      }

      else {
        this.removeOPUFromArray(opu.id);
        this.addOPUToArray(opu);
      }

    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  async loadOPUSessions() {
    let opu: OPU = this.newOPU();
    opu.status = 'Done'
    const data = await this.opuService.get(opu);

    this.opuSessions.set([]);

    for (let opu of data) {
      this.addOPUToArray(opu);
    }
  }

  openCreateModal() {
    this.open(this.createModal, 'xl');
  }

  reset() {
    this.patientForSearch = this.newPatient();
    this.patients.set([]);
  }

  async searchForPatients() {
    const data = await this.patientService.get(this.patientForSearch);
    this.patients.set(data);
  }

  async createOPU(patient: Patient) {
    let opu: OPU = this.newOPU();
    opu.values = this.buildInitialValues();
    opu.patient = { ...patient };
    opu.status = 'Created';

    await this.opuService.add(opu);

    this.closeModal();
  }

  async saveOPU(opu: OPU) {
    opu.status = 'Done';
    await this.opuService.update(opu);

    this.removeOPUFromArray(opu.id);
  }

  async deleteOPU(opu: OPU) {
    const deleted = await this.opuService.delete(opu);

    if (deleted) {
      this.removeOPUFromArray(opu.id);
    }
  }

  async startOPU(opu: OPU) {
    opu.values['opuStartTime'] = this.getCurrentTime();
    opu.status = 'In Progress';

    await this.opuService.update(opu);
  }

  async finishOPU(opu: OPU) {
    opu.values['opuFinishTime'] = this.getCurrentTime();
    opu.status = 'Completed';

    await this.opuService.update(opu);
  }

  async resetOPU(opu: OPU) {
    opu.values = this.buildInitialValues();
    opu.status = 'Created';

    await this.opuService.update(opu);
  }

  async addTube(opu: OPU) {
    let tubes = [];

    if (opu.values['tubes'] != null) {
      tubes = opu.values['tubes'];
    }

    tubes.push({
      tubeNumber: tubes.length + 1,
      oocytes: 0,
      notes: ''
    });

    opu.values['tubes'] = tubes;

    await this.opuService.update(opu);
  }

  async increaseOocyte(opu: OPU, tube: any) {
    tube.oocytes = tube.oocytes + 1;

    await this.opuService.update(opu);
  }

  async decreaseOocyte(opu: OPU, tube: any) {
    if (tube.oocytes > 0) {
      tube.oocytes = tube.oocytes - 1;
    }

    await this.opuService.update(opu);
  }

  async setNoOocyte(opu: OPU, tube: any) {
    tube.oocytes = 0;

    await this.opuService.update(opu);
  }

  async updateNotes(opu: OPU) {
    await this.opuService.update(opu);
  }



  addOPUToArray(opu: OPU) {
    let temp: OPU[] = [];

    temp = [...this.opuSessions()];

    temp.push({ ...opu });

    this.opuSessions.set(temp);
  }

  removeOPUFromArray(id: any) {
    let temp: OPU[] = [];

    temp = [...this.opuSessions()];

    for (let i = 0; i < temp.length; i++) {
      if (temp[i].id == id) {
        temp.splice(i, 1);
      }
    }

    this.opuSessions.set(temp);
  }

  getTotalTubes(): number {

    let total = 0;

    for (let opu of this.opuSessions()) {

      if (opu.values != null && opu.values['tubes'] != null) {
        total = total + opu.values['tubes'].length;
      }
    }

    return total;
  }

  getTotalOocytes(): number {

    let total = 0;

    for (let opu of this.opuSessions()) {

      if (opu.values != null && opu.values['tubes'] != null) {

        for (let tube of opu.values['tubes']) {
          total = total + tube.oocytes;
        }
      }
    }

    return total;
  }

  getNoOocyteTubes(): number {

    let total = 0;

    for (let opu of this.opuSessions()) {

      if (opu.values != null && opu.values['tubes'] != null) {

        for (let tube of opu.values['tubes']) {

          if (tube.oocytes === 0) {
            total = total + 1;
          }
        }
      }
    }

    return total;
  }

  buildInitialValues(): any {
    return {
      opuStartTime: '',
      opuFinishTime: '',
      tubes: []
    };
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString();
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

  newOPU(): OPU {
    return {
      id: '',
      values: this.buildInitialValues(),
      status: '',
      patient: this.newPatient(),
      createdDate: '',
      modifiedDate: '',
      isDeleted: false
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