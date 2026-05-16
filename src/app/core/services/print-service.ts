import { Injectable } from '@angular/core';
import { Patient } from '../../models/patient';
import { ProcedureType } from '../../models/procedure-type';
import { Procedure } from '../../models/procedure';
import { PrintConfigurations } from '../../models/print-configurations';

@Injectable({ providedIn: 'root' })
export class PrintService {

  printLabels(procedure: Procedure, copies: number = 8): void {

    let html = '';

    for (let i = 0; i < copies; i++) {
      html = html + this.buildLabel(procedure);
    }

    const win = window.open('', '_blank');

    if (!win) {
      alert('Popup blocked!');
      return;
    }

    win.document.write(`
      <html>
      <head>
        <title>Print Labels</title>
        <style>
          @page { size: A4; margin: 5mm; }

          body {
            display: flex;
            flex-wrap: wrap;
            gap: 5mm;
            font-family: Arial;
          }

          .label {
            width: 7cm;
            height: 2.5cm;
            border: 1px solid #000;
            display: flex;
            padding: 5px;
            box-sizing: border-box;
          }

          .qr {
            width: 2cm;
            text-align: center;
          }

          .qr img {
            width: 1cm;
            height: 1cm;
          }

          .info {
            font-size: 10px;
            flex: 1;
          }

          .name {
            font-size: 9px;
            font-weight: bold;
          }

          .cpr {
            font-size: 8px;
          }
        </style>
      </head>

      <body onload="window.print(); window.close();">
        ${html}
      </body>
      </html>
    `);

    win.document.close();
  }

  private buildLabel(procedure: Procedure): string {
    return `
      <div class="label">
        <div class="qr">
          <div class="name">${procedure.patient.name || ''}</div>
          <img src="${procedure.qrCode}" />
          <div class="cpr">${procedure.patient.id || ''}</div>
        </div>

        <div class="info">
          <div>File: IVF-${procedure.patient.id} || ''}</div>
          <div>Age: ${procedure.patient.age || ''}</div>
          <div>Phone: ${procedure.patient.phoneNumber || ''}</div>
        </div>
      </div>
    `;
  }

  printWorksheet(procedure: Procedure, printConfigurations: PrintConfigurations): void {

    let html = procedure.procedureType.worksheetTemplate
      .replaceAll('{{header}}', printConfigurations.header || '')
      .replaceAll('{{qr}}', procedure.qrCode)
      .replaceAll('{{patient.name}}', procedure.patient.name || '')
      .replaceAll('{{patient.nationalId}}', procedure.patient.nationalId || '')
      .replaceAll('{{patient.phoneNumber}}', procedure.patient.phoneNumber || '')
      .replaceAll('{{patient.age}}', procedure.patient.age?.toString() || '')
      .replaceAll('{{patient.husbandName}}', procedure.patient.husbandName || '')
      .replaceAll('{{patient.husbandNationalId}}', procedure.patient.husbandNationalId || '')
      .replaceAll('{{patient.husbandPhoneNumber}}', procedure.patient.husbandPhoneNumber || '')
      .replaceAll('{{type}}', procedure.procedureType.name.toUpperCase() || 'WORKSHEET');


    const win = window.open('', '_blank');

    if (!win) {
      alert('Popup blocked!');
      return;
    }

    win.document.write(html);

    win.document.close();
  }

  private buildWorksheet(procedure: Procedure): string {

    const patient = procedure.patient;
    const qr = procedure.qrCode;
    const type = procedure.procedureType?.name;

    const baseHeader = `
    <div style="text-align:center; margin-bottom:15px;">
      <h1 style="color:#1e4663; margin:0;">
        DR. SALAM JIBREL MEDICAL CENTER
      </h1>
      <p style="color:#2c7da0;">
        Embryology & Andrology Laboratory
      </p>
    </div>

    <div class="qr-header" style="
      display:flex;
      align-items:center;
      margin-bottom:15px;
      padding:10px;
      background:#f8f9fa;
      border-radius:12px;
    ">
      <img src="${qr}" style="width:1cm;height:1cm;" />
      <div style="margin-left:15px;">
        <strong>Patient QR Code (1x1cm)</strong><br>
        <span style="font-size:10px;">
          CPR: ${patient.id || ''} | Name: ${patient.name || ''}
        </span>
      </div>
    </div>

    <div style="
      text-align:center;
      border-bottom:2px solid #1e4663;
      padding-bottom:8px;
      margin-bottom:20px;
    ">
      <h2>${type?.toUpperCase() || 'WORKSHEET'}</h2>
    </div>

    <div style="
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap:15px;
      background:#f0f6fa;
      padding:15px;
      border-radius:16px;
      margin-bottom:20px;
      font-size:12px;
    ">
      <div>
        <strong>👩 Patient:</strong> ${patient.name || ''}<br>
        <strong>Age:</strong> ${patient.age || ''}<br>
        <strong>Phone:</strong> ${patient.phoneNumber || ''}
      </div>

      <div>
        <strong>👨 Husband:</strong> ${patient.husbandName || ''}<br>
        <strong>CPR:</strong> ${patient.husbandNationalId || ''}<br>
        <strong>File:</strong> ${patient.id || ''}
      </div>
    </div>
  `;

    let rows = '';

    switch (type) {

      case 'semen_analysis':
        rows = `
        <tr><td>Volume (ml)</td><td></td><td>≥ 1.5</td></tr>
        <tr><td>Concentration (10⁶/ml)</td><td></td><td>≥ 15</td></tr>
        <tr><td>Progressive Motility (%)</td><td></td><td>≥ 32</td></tr>
        <tr><td>Total Motility (%)</td><td></td><td>≥ 40</td></tr>
        <tr><td>Normal Morphology (%)</td><td></td><td>≥ 4</td></tr>
        <tr><td>pH</td><td></td><td>7.2 - 8.0</td></tr>
        <tr><td>WBC</td><td></td><td>&lt; 1 million/ml</td></tr>
      `;
        break;

      case 'semen_preparation_iui':
        rows = `
        <tr><td>Preparation Method</td><td></td><td>Swim-up / Gradient</td></tr>
        <tr><td>Initial Count</td><td></td><td></td></tr>
        <tr><td>Post Wash Count</td><td></td><td></td></tr>
        <tr><td>Post Wash Motility</td><td></td><td></td></tr>
        <tr><td>Total Motile Sperm</td><td></td><td></td></tr>
      `;
        break;

      case 'opu':
        rows = `
        <tr><td>Total Oocytes Retrieved</td><td></td><td></td></tr>
        <tr><td>MII Oocytes</td><td></td><td></td></tr>
        <tr><td>MI Oocytes</td><td></td><td></td></tr>
        <tr><td>GV Oocytes</td><td></td><td></td></tr>
        <tr><td>ICSI Performed</td><td></td><td>Yes / No</td></tr>
        <tr><td>Fertilized (2PN)</td><td></td><td></td></tr>
      `;
        break;

      case 'dna_fragmentation':
        rows = `
        <tr><td>Method</td><td></td><td>SCSA / TUNEL / SCD</td></tr>
        <tr><td>DFI (%)</td><td></td><td></td></tr>
        <tr><td>Interpretation</td><td></td><td>Low / Moderate / High</td></tr>
      `;
        break;

      case 'testicular_sperm':
        rows = `
        <tr><td>Procedure Type</td><td></td><td>TESA / PESA / microTESE</td></tr>
        <tr><td>Sperm Found</td><td></td><td>Yes / No</td></tr>
        <tr><td>Motility</td><td></td><td></td></tr>
        <tr><td>Freezing Straws</td><td></td><td></td></tr>
      `;
        break;

      case 'retrograde_ejaculate':
        rows = `
        <tr><td>Urine pH</td><td></td><td></td></tr>
        <tr><td>Sperm Count</td><td></td><td></td></tr>
        <tr><td>Motility</td><td></td><td></td></tr>
        <tr><td>Total Recovery</td><td></td><td></td></tr>
      `;
        break;

      default:
        rows = `
        <tr><td colspan="3">No procedure selected</td></tr>
      `;
    }

    return `
    ${baseHeader}

    <table style="
      width:100%;
      border-collapse:collapse;
      margin-bottom:20px;
    ">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Result</th>
          <th>Reference / Notes</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div style="margin-top:30px; display:flex; justify-content:space-between;">
      <div><strong>Lab Director Signature:</strong> ____________________</div>
      <div><strong>Date:</strong> ___________</div>
    </div>

    <div style="text-align:center; font-size:9px; margin-top:20px; color:#888;">
      DR. SALAM JIBREL MEDICAL CENTER | QR ID: ${patient.id || ''}
    </div>
  `;
  }

  printArea(printConfigurations: PrintConfigurations) {
    const element = document.getElementById('print-area') as HTMLElement;

    if (!element) {
      alert('Print area not found!');
      return;
    }

    const clone = element.cloneNode(true) as HTMLElement;

    // Remove buttons and no-print elements
    clone.querySelectorAll('.no-print').forEach(el => el.remove());

    // ----- Handle radio buttons -----
    const handledRadioNames = new Set<string>();
    clone.querySelectorAll('input[type="radio"]').forEach((el) => {
      const radio = el as HTMLInputElement;

      if (handledRadioNames.has(radio.name)) return;
      handledRadioNames.add(radio.name);

      const checkedRadio = clone.querySelector(
        `input[type="radio"][name="${radio.name}"]:checked`
      ) as HTMLInputElement | null;

      const groupContainer =
        radio.closest('.card-body') || radio.closest('.d-flex') || radio.parentElement;

      const selectedText = checkedRadio
        ? clone.querySelector(`label[for="${checkedRadio.id}"]`)?.textContent?.trim() || checkedRadio.value
        : '';

      const valueDiv = document.createElement('div');
      valueDiv.className = 'radio-print-value';
      valueDiv.innerText = selectedText;

      if (groupContainer) {
        groupContainer.innerHTML = '';
        groupContainer.appendChild(valueDiv);
      }
    });

    // ----- Replace other inputs -----
    clone.querySelectorAll('input').forEach((el) => {
      const inputEl = el as HTMLInputElement;
      if (inputEl.type === 'radio') return;

      const span = document.createElement('span');
      if (inputEl.type === 'checkbox') {
        span.innerText = inputEl.checked ? 'Yes' : 'No';
      } else {
        span.innerText = inputEl.value || '';
      }
      span.className = 'print-value';
      inputEl.parentNode?.replaceChild(span, inputEl);
    });

    // ----- Replace textareas -----
    clone.querySelectorAll('textarea').forEach((el) => {
      const textareaEl = el as HTMLTextAreaElement;
      const div = document.createElement('div');
      div.innerText = textareaEl.value || '';
      div.className = 'print-value textarea-print';
      textareaEl.parentNode?.replaceChild(div, textareaEl);
    });

    // ----- Replace selects with span -----
    clone.querySelectorAll('select').forEach((el) => {
      const selectEl = el as HTMLSelectElement;
      const span = document.createElement('span');
      const selectedOption = selectEl.options[selectEl.selectedIndex];
      span.innerText = selectedOption ? selectedOption.text : '';
      span.className = 'select-print-value';
      selectEl.parentNode?.replaceChild(span, selectEl);
    });

    // ----- Expand tables -----
    clone.querySelectorAll('.table-responsive').forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.overflow = 'visible';
      htmlEl.style.maxHeight = 'none';
    });

    clone.querySelectorAll('table').forEach((table) => {
      const htmlTable = table as HTMLTableElement;
      htmlTable.style.width = '100%';
      htmlTable.style.overflow = 'visible';
      htmlTable.style.tableLayout = 'auto';
    });

    const printContents = clone.innerHTML;

    const win = window.open('', '_blank');
    if (!win) {
      alert('Popup blocked!');
      return;
    }

    win.document.write(`
    <html>
      <head>
        <title>Print Report</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        >
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        >

        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            padding: 10px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          th, td {
            border: 1px solid #dee2e6;
            padding: 4px 6px;
            text-align: left;
          }

          th {
            background-color: #f8f9fa;
            font-weight: bold;
            font-size: 11px;
          }

          .btn{
            font-size: 11px;
            color: #333;
            text
            text-align: left !important;
            padding:0;
            border: none;
          }
          p{
            font-size: 11px;
          }

          .card-header {
            display: block !important;
            background-color: #f8f9fa !important;
            color: #000 !important;
            font-weight: bold;
            padding: 8px;
            font-size: 12px;
            border-bottom: 1px solid #dee2e6;
          }

          .print-value, .textarea-print, .select-print-value {
            display: block;
            min-height: 24px;
            padding: 3px 6px;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            background-color: #fff;
            font-size: 11px;
            white-space: pre-wrap;
          }

          .textarea-print {
            min-height: 50px;
          }

          .radio-print-value {
            font-size: 11px;
            font-weight: 600;
            color: #000;
            text-align: left;
            margin: 0;
            padding: 2px 0;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .no-print {
              display: none !important;
            }

            .table-responsive {
              overflow: visible !important;
              max-height: none !important;
            }
          }
        </style>
      </head>

      <body onload="window.print(); window.close();">
        ${printConfigurations.header}
        ${printContents}
      </body>
    </html>
  `);

    win.document.close();
  }

}