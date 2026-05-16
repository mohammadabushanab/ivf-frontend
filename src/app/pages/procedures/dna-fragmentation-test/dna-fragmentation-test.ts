import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { Procedure } from '../../../models/procedure';
import { NumbersOnly } from '../../../shared/directives/numbers-only';
import { TextOnly } from '../../../shared/directives/text-only';

@Component({
  selector: 'app-dna-fragmentation-test',
  imports: [FormsModule, CommonModule, NumbersOnly, TextOnly],
  templateUrl: './dna-fragmentation-test.html',
  styleUrl: './dna-fragmentation-test.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class DNAFragmentationTest {

  @Input()
  procedure!: Procedure;

  generate(data: any) {

    // =========================
    // SAFE PARSING (your fields)
    // =========================
    const abstinence = parseFloat(data.abstinence) || 0;
    const ph = parseFloat(data.ph) || 0;
    const volume = parseFloat(data.volume) || 0;
    const liquefaction = parseFloat(data.liquefaction) || 0;

    const motility = parseFloat(data.motility) || 0;
    const progressive = parseFloat(data.progressiveMotility) || 0;
    const rapid = parseFloat(data.rapid) || 0;
    const slow = parseFloat(data.slow) || 0;
    const nonProg = parseFloat(data.nonProgressive) || 0;
    const immotile = parseFloat(data.immotility) || 0;

    const spermCount = parseFloat(data.spermCount) || 0;
    const totalSperm = parseFloat(data.totalSpermCount) || 0;
    const wbcs = parseFloat(data.wbcs) || 0;

    const normalMorph = parseFloat(data.normalMorphology) || 0;
    const abnormalMorph = parseFloat(data.abnormalMorphology) || 0;

    const head = parseFloat(data.abnormalHead) || 0;
    const mid = parseFloat(data.abnormalMid) || 0;
    const tail = parseFloat(data.abnormalTail) || 0;

    const fragmented = parseFloat(data.fragmentedSperms) || 0;
    const counted = parseFloat(data.totalCountedSperms) || 0;

    // SDFI can be directly entered OR calculated
    let sdfi = parseFloat(data.sdfi);
    if (!sdfi && counted > 0) {
      sdfi = (fragmented / counted) * 100;
    }

    // =========================
    // REPORT BUILDING
    // =========================
    let text = "DNA FRAGMENTATION & SEMEN ANALYSIS REPORT\n\n";

    // =========================
    // MACROSCOPIC
    // =========================
    text += "MACROSCOPIC PARAMETERS:\n";

    text += abstinence >= 2 && abstinence <= 5
      ? "✓ Abstinence period within normal range.\n"
      : "⚠ Abstinence period abnormal.\n";

    text += ph >= 7.2
      ? "✓ pH is normal.\n"
      : "⚠ pH is below reference range.\n";

    text += volume >= 1.5
      ? "✓ Semen volume normal.\n"
      : "⚠ Low semen volume.\n";

    text += liquefaction <= 30
      ? "✓ Liquefaction time normal.\n"
      : "⚠ Delayed liquefaction.\n";


    // =========================
    // MOTILITY
    // =========================
    text += "\nMOTILITY ANALYSIS:\n";

    if (motility >= 40) {
      text += "✓ Total motility within normal limits.\n";
    } else if (motility > 0) {
      text += "⚠ Asthenozoospermia (reduced motility).\n";
    } else {
      text += "✗ No motility detected.\n";
    }

    text += progressive >= 32
      ? "✓ Progressive motility is adequate.\n"
      : "⚠ Reduced progressive motility.\n";

    // Distribution check (important clinical insight)
    const motSum = rapid + slow + nonProg + immotile;
    if (motSum > 0) {
      text += `ℹ Motility distribution: Rapid ${rapid}%, Slow ${slow}%, Non-progressive ${nonProg}%, Immotile ${immotile}%.\n`;
    }


    // =========================
    // SPERM COUNT
    // =========================
    text += "\nSPERM CONCENTRATION:\n";

    if (spermCount >= 20) {
      text += "✓ Sperm concentration normal.\n";
    } else if (spermCount > 0) {
      text += "⚠ Oligozoospermia.\n";
    } else {
      text += "✗ Azoospermia.\n";
    }

    if (totalSperm >= 40) {
      text += "✓ Total sperm count adequate.\n";
    } else {
      text += "⚠ Low total sperm count.\n";
    }

    if (wbcs < 1) {
      text += "✓ No significant leukocytospermia.\n";
    } else {
      text += "⚠ Elevated WBCs (possible infection/inflammation).\n";
    }


    // =========================
    // MORPHOLOGY
    // =========================
    text += "\nMORPHOLOGY:\n";

    if (normalMorph >= 4) {
      text += "✓ Normal morphology within WHO threshold.\n";
    } else if (normalMorph > 0) {
      text += "⚠ Teratozoospermia (abnormal morphology).\n";
    } else {
      text += "✗ Severely abnormal morphology.\n";
    }

    if (abnormalMorph > 0) {
      text += `ℹ Defects: Head ${head}%, Midpiece ${mid}%, Tail ${tail}%.\n`;
    }


    // =========================
    // DNA FRAGMENTATION (IMPORTANT PART)
    // =========================
    text += "\nDNA FRAGMENTATION INDEX (DFI):\n";

    text += `DFI = ${sdfi.toFixed(1)}%\n`;

    if (sdfi < 15) {
      text += "✓ Good DNA integrity.\n";
    } else if (sdfi <= 30) {
      text += "⚠ Intermediate DNA fragmentation.\n";
    } else {
      text += "✗ High DNA fragmentation (poor prognosis).\n";
    }


    // =========================
    // FINAL CLINICAL SUMMARY
    // =========================
    const normalFlags = [
      abstinence >= 2 && abstinence <= 5,
      ph >= 7.2,
      volume >= 1.5,
      liquefaction <= 30,
      motility >= 40,
      progressive >= 32,
      spermCount >= 20,
      normalMorph >= 4,
      sdfi < 15
    ];

    const normalCount = normalFlags.filter(Boolean).length;

    text += "\nOVERALL INTERPRETATION:\n";

    if (sdfi > 30 || spermCount === 0) {
      text += "SEVERE REPRODUCTIVE IMPAIRMENT.\n";
    } else if (normalCount >= 7) {
      text += "NORMOZOOSPERMIA WITH GOOD DNA INTEGRITY.\n";
    } else if (normalCount >= 5) {
      text += "MILD TO MODERATE SEMINAL ABNORMALITIES.\n";
    } else {
      text += "SIGNIFICANT SEMINAL ABNORMALITIES.\n";
    }

    // Save result
    this.procedure.values['aiInterpretation'] = text;
  }
}
