import { CommonModule } from '@angular/common';
import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { Procedure } from '../../models/procedure';
import { ProcedureService } from '../../core/services/procedure-service';
import { PrintService } from '../../core/services/print-service';
import { LookupService } from '../../core/services/lookup-service';
import { PrintConfigurations } from '../../models/print-configurations';
import { DNAFragmentationTest } from '../procedures/dna-fragmentation-test/dna-fragmentation-test';
import { EggFreezing } from '../procedures/egg-freezing/egg-freezing';
import { EmbryoFreezing } from '../procedures/embryo-freezing/embryo-freezing';
import { OocytePickUp } from '../procedures/oocyte-pick-up/oocyte-pick-up';
import { OvarianTissueCryopreservation } from '../procedures/ovarian-tissue-cryopreservation/ovarian-tissue-cryopreservation';
import { RetrogradeEjaculateAnalysis } from '../procedures/retrograde-ejaculate-analysis/retrograde-ejaculate-analysis';
import { SemenAnalysis } from '../procedures/semen-analysis/semen-analysis';
import { SemenPreparationForIui } from '../procedures/semen-preparation-for-iui/semen-preparation-for-iui';
import { SpermFreezing } from '../procedures/sperm-freezing/sperm-freezing';
import { TesticularSpermRetrieval } from '../procedures/testicular-sperm-retrieval/testicular-sperm-retrieval';
import { ProcedureType } from '../../models/procedure-type';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule, NgbNav, NgbNavItem, NgbNavContent, NgbNavOutlet, NgbNavLinkButton, DNAFragmentationTest, EggFreezing, EmbryoFreezing, OocytePickUp, OvarianTissueCryopreservation, RetrogradeEjaculateAnalysis, SemenAnalysis, SemenPreparationForIui, SpermFreezing, TesticularSpermRetrieval],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  active = 1;

  messageText: string = "";

  reportForSearch: Procedure = this.newProcedure();
  reportForViewAndPrint: Procedure = this.newProcedure();

  reports = signal<Procedure[]>([]);
  procedureTypes = signal<ProcedureType[]>([]);

  private procedureService = inject(ProcedureService);
  private modalService = inject(NgbModal);
  private printService = inject(PrintService);
  private lookupService = inject(LookupService);

  printConfigurations: PrintConfigurations = this.newPrintConfigurations();

  currentModalRef!: NgbModalRef;

  @ViewChild('reportTemplate')
  reportModal!: TemplateRef<any>;


  async ngOnInit(): Promise<void> {
    const procedureTypes = await this.lookupService.getProcedureTypes();
    this.procedureTypes.set(procedureTypes);

    const printConfigurations = await this.lookupService.getPrintConfigurations();

    if (printConfigurations != null) {
      this.printConfigurations = printConfigurations;
    }
  }

  async searchForReports() {
    this.reportForSearch.isReport = true;
    const data = await this.procedureService.get(this.reportForSearch);
    this.reports.set(data);
  }

  openReportModal(report: Procedure) {
    this.reportForViewAndPrint = { ...report }
    this.open(this.reportModal, 'Fullscreen')
  }

  reset() {
    this.reportForSearch = this.newProcedure();
    this.reports.set([])
  }

  printPage() {
    this.printService.printArea(this.printConfigurations);
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
      scheduledDate: '',
      dateSearchType: '',
      notes:'',
      isPaid: false,
      isReport: false,
      fromDate: '',
      toDate: '',
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

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

}
