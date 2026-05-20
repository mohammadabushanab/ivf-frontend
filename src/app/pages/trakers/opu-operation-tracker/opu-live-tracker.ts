import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Patient } from '../../../models/patient';
import { OPU } from '../../../models/opu';
import { PatientService } from '../../../core/services/patient-service';
import { SocketService } from '../../../core/services/socket-service';
import { OPUService } from '../../../core/services/opu-service';

@Component({
  selector: 'app-opu-live-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opu-live-tracker.html',
  styleUrl: './opu-live-tracker.css',
})
export class OPULiveTracker implements OnInit, OnDestroy {

  private patientService = inject(PatientService);
  private opuService = inject(OPUService);
  private socketService = inject(SocketService);

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
    const data = await this.opuService.get(this.newOPU());

    this.opuSessions.set([]);

    for (let opu of data) {
      this.addOPUToArray(opu);
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

  async createOPUFromPatient(patient: Patient) {
    const opu: OPU = {
      id: '',
      values: this.buildInitialValues(),
      patient: patient,
      createdDate: '',
      modifiedDate: '',
      isDeleted: false
    };

    await this.opuService.add(opu);
  }

  async startOPU(opu: OPU) {
    opu.values['opuStarted'] = true;
    opu.values['opuFinished'] = false;
    opu.values['opuStartTime'] = this.getCurrentTime();

    await this.opuService.update(opu);
  }

  async finishOPU(opu: OPU) {
    opu.values['opuFinished'] = true;
    opu.values['opuFinishTime'] = this.getCurrentTime();

    await this.opuService.update(opu);
  }

  async resetOPU(opu: OPU) {
    opu.values = this.buildInitialValues();

    await this.opuService.update(opu);
  }

  async addTube(opu: OPU) {
    let tubes = opu.values['tubes'] || [];

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

  async deleteOPU(opu: OPU) {
   const deleted =  await this.opuService.delete(opu);

    if (deleted) {
      this.removeOPUFromArray(opu.id);
    }
  }

  addOPUToArray(opu: OPU) {
    let temp: OPU[] = [];

    temp = [...this.opuSessions()];

    temp.push({ ...opu });

    this.opuSessions.set(temp);
  }

  removeOPUFromArray(id: any) {
    let temp: OPU[] = [];
    let filtered: OPU[] = [];

    temp = [...this.opuSessions()];

    for (let i = 0; i < temp.length; i++) {
      if (temp[i].id !== id) {
        filtered.push(temp[i]);
      }
    }

    this.opuSessions.set(filtered);
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
      opuStarted: false,
      opuFinished: false,
      opuStartTime: '',
      opuFinishTime: '',
      tubes: []
    };
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString();
  }

  newOPU(): OPU {
    return {
      id: '',
      values: this.buildInitialValues(),
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