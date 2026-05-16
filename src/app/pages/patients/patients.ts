import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavContent, NgbNav, NgbNavItem, NgbNavLinkButton, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap/nav';
import { PatientService } from '../../core/services/patient-service';
import { Patient } from '../../models/patient';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NumbersOnly } from '../../shared/directives/numbers-only';
import { TextOnly } from '../../shared/directives/text-only';
import { LookupService } from '../../core/services/lookup-service';
import { ProcedureType } from '../../models/procedure-type';
import { User } from '../../models/user';
import { UserService } from '../../core/services/user-service';
import { Procedure } from '../../models/procedure';
import { ProcedureService } from '../../core/services/procedure-service';
import { PrintService } from '../../core/services/print-service';
import { AuthService } from '../../core/services/auth-service';
import { PrintConfigurations } from '../../models/print-configurations';


@Component({
  standalone: true,
  selector: 'app-patients',
  imports: [NgbNav, NgbNavItem, NgbNavContent, NgbNavOutlet, NgbNavLinkButton, FormsModule, CommonModule, NumbersOnly, TextOnly, FormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients {
  active = 1;

  messageText: string = "";

  patientForAdd: Patient = this.newPatient();
  patientForSearch: Patient = this.newPatient();
  patientForEdit: Patient = this.newPatient();

  patients = signal<Patient[]>([]);

  procedure: Procedure = this.newProcedure();

  procedureTypes = signal<ProcedureType[]>([]);
  physicians = signal<User[]>([]);

  printConfigurations: PrintConfigurations = this.newPrintConfigurations();

  private modalService = inject(NgbModal);
  private patientService = inject(PatientService);
  private lookupService = inject(LookupService);
  private userService = inject(UserService);
  private procedureService = inject(ProcedureService);
  private printService = inject(PrintService);
  private authService = inject(AuthService);

  role = this.authService.getRole();

  currentModalRef!: NgbModalRef;

  @ViewChild('messageTemplate')
  messageModal!: TemplateRef<any>;

  @ViewChild('procedureMessageTemplate')
  procedureMessageModal!: TemplateRef<any>;

  @ViewChild('editTemplate')
  editModal!: TemplateRef<any>;

  @ViewChild('procedureTemplate')
  procedureModal!: TemplateRef<any>;

  @ViewChild('reportsTemplate')
  reportsModal!: TemplateRef<any>;

  async ngOnInit(): Promise<void> {
    const procedureTypes = await this.lookupService.getProcedureTypes();
    this.procedureTypes.set(procedureTypes);

    const printConfigurations = await this.lookupService.getPrintConfigurations();

    if (printConfigurations != null) {
      this.printConfigurations = printConfigurations;
    }

    let searchCriteria: User = {
      id: '',
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: 'Physician',
      token: '',
      isLoggedIn: false,
      newPassword: ''
    };

    const usersByRole = await this.userService.getUsersByRole(searchCriteria);
    this.physicians.set(usersByRole);
  }

  async searchForPatients() {
    const data = await this.patientService.get(this.patientForSearch);
    this.patients.set(data);
  }

  async addPatient() {
    const data = await this.patientService.add(this.patientForAdd);

    if (data) {
      this.messageText = "Your Request has been submitted successfully";
    }
    else {
      this.messageText = "Something went wrong while submitting the Request";

    }
    this.open(this.messageModal, 'lg')

    this.patientForAdd = this.newPatient();

  }

  async updatePatient() {

    const data = await this.patientService.update(this.patientForEdit);

    if (data != null) {
      let tempPatients: Patient[] = this.patients();

      for (let i = 0; i < tempPatients.length; i++) {
        if (tempPatients[i].id == this.patientForEdit.id) {
          tempPatients[i] = { ...data }
          break;
        }
      }

      this.patients.set(tempPatients);

      this.closeModal();
      this.messageText = "Your Request has been submitted successfully";
    }
    else {
      this.messageText = "Something went wrong while submitting the Request";

    }
    this.open(this.messageModal, 'lg')

    this.patientForEdit = this.newPatient();

  }

  async deletePatient(patient: Patient) {
    const data = await this.patientService.delete(patient);

    if (data) {
      let tempPatients: Patient[] = this.patients();

      for (let i = 0; i < tempPatients.length; i++) {
        if (tempPatients[i].id == patient.id) {
          tempPatients.splice(i, 1);
          break;
        }
      }

      this.patients.set(tempPatients);

      this.closeModal();
      this.messageText = "Request has been submitted successfully";
    }
    else {
      this.messageText = "Something went wrong while submitting the Request";

    }
    this.open(this.messageModal, 'lg')

  }

  async addProcedure() {

    console.log("this.procedure" + this.procedure)

    const data = await this.procedureService.add(this.procedure);

    if (data != null) {

      this.messageText = "Your Request has been submitted successfully";

      this.closeModal();

      // const qrCode = await this.qrService.generateQrDataUrl(String(data.id), 100);

      // this.procedure.qrCode = qrCode;


      // if (this.procedure.paymentStatus == "Paid") {
      //   this.open(this.procedureMessageModal, 'lg')
      // }
      // else {
      //   this.open(this.messageModal, 'lg')
      // }

      this.open(this.messageModal, 'lg')
    }
    else {
      this.messageText = "Something went wrong while submitting the Request";
      this.open(this.messageModal, 'lg')

    }
  }

  printWorkSheet() {
    this.printService.printWorksheet(this.procedure, this.printConfigurations);
  }

  printLabels() {
    this.printService.printLabels(this.procedure);
  }

  reset() {
    this.patientForAdd = this.newPatient();
    this.patientForSearch = this.newPatient();
    this.patientForEdit = this.newPatient();
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
      createdDate: '',
      modifiedDate: ''
    };
  }

  newPrintConfigurations(): PrintConfigurations {
    return {
      id: '',
      header: ''
    }
  }

  newProcedure(): Procedure {
    return {
      id: '',
      qrCode: '',
      values: {},
      paymentStatus: '',
      createdDate: '',
      modifiedDate: '',
      isPaid: false,
      isReport: false,
      procedureType: {
        id: '',
        name: '',
        worksheetTemplate: '',
        price: ''
      },
      patient: {
        id: '',
        nationalId: '',
        name: '',
        phoneNumber: '',
        age: '',
        husbandNationalId: '',
        husbandName: '',
        husbandPhoneNumber: '',
        createdDate: '',
        modifiedDate: '',
      },
      physician: {
        id: '',
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: '',
        token: '',
        isLoggedIn: false,
        newPassword: ''
      },
      embryologist: {
        id: '',
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: '',
        token: '',
        isLoggedIn: false,
        newPassword: ''
      }
    };
  }

  openEditModal(patient: Patient) {
    this.patientForEdit = { ...patient };
    this.open(this.editModal, 'xl')
  }

  openProcedureModal(patient: Patient) {
    this.procedure = this.newProcedure();

    this.procedure.patient = { ...patient };

    if (this.role == "Physician") {
      this.procedure.paymentStatus = "Unpaid"
    }

    this.open(this.procedureModal, 'xl')
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

  onNavChange() {
    this.reset();
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  isAddProceDureDisabled(): boolean{
    if(this.procedure.procedureType.id != ''){
      return false;
    }
    return true;
  }

}
