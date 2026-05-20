import { CommonModule } from '@angular/common';
import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { Procedure } from '../../models/procedure';
import { ProcedureType } from '../../models/procedure-type';
import { User } from '../../models/user';
import { LookupService } from '../../core/services/lookup-service';
import { UserService } from '../../core/services/user-service';
import { ProcedureService } from '../../core/services/procedure-service';
import { QrService } from '../../core/services/qrcode-service';
import { PrintService } from '../../core/services/print-service';
import { AuthService } from '../../core/services/auth-service';
import { SemenAnalysis } from './semen-analysis/semen-analysis';
import { PrintConfigurations } from '../../models/print-configurations';
import { SpermFreezing } from './sperm-freezing/sperm-freezing';
import { DNAFragmentationTest } from './dna-fragmentation-test/dna-fragmentation-test';
import { OocytePickUp } from './oocyte-pick-up/oocyte-pick-up';
import { TesticularSpermRetrieval } from './testicular-sperm-retrieval/testicular-sperm-retrieval';
import { SemenPreparationForIui } from './semen-preparation-for-iui/semen-preparation-for-iui';
import { RetrogradeEjaculateAnalysis } from './retrograde-ejaculate-analysis/retrograde-ejaculate-analysis';
import { OvarianTissueCryopreservation } from './ovarian-tissue-cryopreservation/ovarian-tissue-cryopreservation';
import { EmbryoFreezing } from './embryo-freezing/embryo-freezing';
import { EggFreezing } from './egg-freezing/egg-freezing';
import { FrozenEmbryoTransfer } from './frozen-embryo-transfer/frozen-embryo-transfer';

@Component({
  selector: 'app-procedures',
  imports: [CommonModule, FormsModule, NgbNav, NgbNavItem, NgbNavContent, NgbNavOutlet, NgbNavLinkButton, DNAFragmentationTest, EggFreezing, EmbryoFreezing, OocytePickUp, OvarianTissueCryopreservation, RetrogradeEjaculateAnalysis, SemenAnalysis, SemenPreparationForIui, SpermFreezing, TesticularSpermRetrieval,FrozenEmbryoTransfer],
  templateUrl: './procedures.html',
  styleUrl: './procedures.css',
})
export class Procedures {
  active = 1;

  messageText: string = "";

  procedureForSearch: Procedure = this.newProcedure();
  procedureForEdit: Procedure = this.newProcedure();
  procedureForPrint: Procedure = this.newProcedure();

  procedures = signal<Procedure[]>([]);
  procedureTypes = signal<ProcedureType[]>([]);
  physicians = signal<User[]>([]);

  printConfigurations: PrintConfigurations = this.newPrintConfigurations();

  private lookupService = inject(LookupService);
  private userService = inject(UserService);
  private procedureService = inject(ProcedureService);
  private modalService = inject(NgbModal);
  private qrService = inject(QrService);
  private printService = inject(PrintService);
  private authService = inject(AuthService);

  role = this.authService.getRole();
  currentUser = this.authService.getUser();

  currentModalRef!: NgbModalRef;

  @ViewChild('editForCoordinatorTemplate')
  editForCoordinatorModal!: TemplateRef<any>;

  @ViewChild('editForEmbryologistTemplate')
  editForEmbryologistModal!: TemplateRef<any>;

  @ViewChild('messageTemplate')
  messageModal!: TemplateRef<any>;

  @ViewChild('procedureMessageTemplate')
  procedureMessageModal!: TemplateRef<any>;

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

  async searchForProcedures() {
    if (this.role == "Embryologist") {
      this.procedureForSearch.isPaid = true;
    }

    const data = await this.procedureService.get(this.procedureForSearch);
    this.procedures.set(data);
  }

  openEditModal(procedure: Procedure) {

    this.procedureForEdit = { ...procedure };

    if (this.role == "Embryologist" && this.currentUser != null) {
      this.procedureForEdit.embryologist = this.currentUser;
    }

    if (this.role == "Coordinator") {
      this.open(this.editForCoordinatorModal, 'xl')
    }
    else {
      this.open(this.editForEmbryologistModal, 'Fullscreen')
    }
  }

  async updateProcedure() {

    const data = await this.procedureService.update(this.procedureForEdit);

    if (data != null) {

      this.closeModal();

      this.procedureForEdit = data;

      this.messageText = "Your Request has been submitted successfully";

      let tempProcdures: Procedure[] = this.procedures();

      for (let i = 0; i < tempProcdures.length; i++) {
        if (tempProcdures[i].id == this.procedureForEdit.id) {
          tempProcdures[i] = { ...this.procedureForEdit }
          break;
        }
      }

      this.procedures.set(tempProcdures);
    }
    else {
      this.messageText = "Something went wrong while submitting the Request";
    }

    this.open(this.messageModal, 'lg');

  }

  async deleteProcedure(procedure: Procedure) {
    const data = await this.procedureService.delete(procedure);

    if (data) {
      let tempPatients: Procedure[] = this.procedures();

      for (let i = 0; i < tempPatients.length; i++) {
        if (tempPatients[i].id == procedure.id) {
          tempPatients.splice(i, 1);
          break;
        }
      }

      this.procedures.set(tempPatients);

      this.messageText = "Request has been submitted successfully";
    }
    else {
      this.messageText = "Something went wrong while submitting the Request";

    }
    this.open(this.messageModal, 'lg')
  }

  reset() {
    this.procedureForSearch = this.newProcedure();
    this.procedureForEdit = this.newProcedure();
    this.procedureForPrint = this.newProcedure();
    this.procedures.set([]);
  }

  async printWorkSheet(procedure: Procedure) {

    const qrCode = await this.qrService.generateQrDataUrl(String(procedure.id), 100);

    procedure.qrCode = qrCode;

    if (procedure.paymentStatus == "Paid") {
      this.printService.printWorksheet(procedure, this.printConfigurations);
    }
    else {
      this.messageText = "Procedure payment is required";
      this.open(this.messageModal, 'lg');
    }

  }

  async printLabels(procedure: Procedure) {

    const qrCode = await this.qrService.generateQrDataUrl(String(procedure.id), 100);

    procedure.qrCode = qrCode;

    if (procedure.paymentStatus == "Paid") {
      this.printService.printLabels(procedure);
    }
    else {
      this.messageText = "Procedure payment is required";
      this.open(this.messageModal, 'lg');
    }
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

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  newProcedure(): Procedure {
    return {
      id: '',
      qrCode: '',
      values: {},
      paymentStatus: '',
      createdDate: '',
      modifiedDate: '',
      scheduledDate: '',
      isPaid: false,
      isReport: false,
      dateSearchType: '',
      fromDate: '',
      toDate: '',
      notes:'',
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
        selectedTreatmentType:'',
        createdDate: '',
        modifiedDate: '',
        fromDate: '',
        toDate: ''
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

  newPrintConfigurations(): PrintConfigurations {
    return {
      id: '',
      header: ''
    }
  }

  isUpdateProceDureDisabled() {
    if (this.procedureForEdit.physician != null && this.procedureForEdit.scheduledDate != null && this.procedureForEdit.scheduledDate != '') {
      return false;
    }
    return true;
  }
}
