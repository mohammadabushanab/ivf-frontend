import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { Procedure } from '../../../models/procedure';
import { NumbersOnly } from '../../../shared/directives/numbers-only';
import { TextOnly } from '../../../shared/directives/text-only';

@Component({
  selector: 'app-semen-analysis',
  imports: [FormsModule, CommonModule, NumbersOnly, TextOnly],
  templateUrl: './semen-analysis.html',
  styleUrl: './semen-analysis.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class SemenAnalysis {

  @Input()
  procedure!: Procedure;

  generate(data: any) {

    // =========================
    // PARSING INPUTS
    // =========================
    const abstinence = parseFloat(data.abstinence) || 0;
    const ph = parseFloat(data.ph) || 0;
    const volume = parseFloat(data.volume) || 0;
    const liquefaction = parseFloat(data.liquefaction) || 0;

    const motility = parseFloat(data.motility) || 0;
    const progressive = parseFloat(data.progressiveMotility) || 0;
    const vitality = parseFloat(data.vitality) || 0;

    const rapid = parseFloat(data.rapid) || 0;
    const slow = parseFloat(data.slow) || 0;
    const nonProg = parseFloat(data.nonProgressive) || 0;
    const immotile = parseFloat(data.immotility) || 0;

    const spermCount = parseFloat(data.spermCount) || 0;
    const totalSperm = parseFloat(data.totalSpermCount) || 0;
    const wbcs = parseFloat(data.wbcs) || 0;
    const rbcs = (data.rbcs || '').toString();

    const immature = parseFloat(data.immatureGermCells) || 0;

    const normalMorph = parseFloat(data.normalMorphology) || 0;
    const abnormalMorph = parseFloat(data.abnormalMorphology) || 0;

    const head = parseFloat(data.abnormalHead) || 0;
    const mid = parseFloat(data.abnormalMid) || 0;
    const tail = parseFloat(data.abnormalTail) || 0;
    const tapered = parseFloat(data.taperedHead) || 0;

    // =========================
    // INIT REPORT
    // =========================
    let text = "SEMEN ANALYSIS REPORT\n\n";

    // =========================
    // MACROSCOPIC
    // =========================
    text += "MACROSCOPIC EXAMINATION:\n";

    text += (abstinence >= 2 && abstinence <= 5)
      ? "✓ Abstinence period normal.\n"
      : "⚠ Abstinence period outside recommended range.\n";

    text += (ph >= 7.2)
      ? "✓ pH within normal range.\n"
      : "⚠ Acidic semen pH.\n";

    text += (volume >= 1.5)
      ? "✓ Semen volume normal.\n"
      : "⚠ Low semen volume.\n";

    text += (liquefaction <= 30)
      ? "✓ Liquefaction time normal.\n"
      : "⚠ Delayed liquefaction.\n";

    text += (data.viscosity === "Normal")
      ? "✓ Viscosity normal.\n"
      : "⚠ Abnormal viscosity.\n";


    // =========================
    // MOTILITY
    // =========================
    text += "\nMOTILITY PROFILE:\n";

    if (motility >= 40) {
      text += "✓ Total motility normal.\n";
    } else if (motility > 0) {
      text += "⚠ Asthenozoospermia (reduced motility).\n";
    } else {
      text += "✗ No motile sperm detected.\n";
    }

    text += (progressive >= 32)
      ? "✓ Progressive motility adequate.\n"
      : "⚠ Reduced progressive motility.\n";

    const motSum = rapid + slow + nonProg + immotile;
    if (motSum > 0) {
      text += `ℹ Motility distribution: Rapid ${rapid}%, Slow ${slow}%, Non-progressive ${nonProg}%, Immotile ${immotile}%.\n`;
    }

    text += (vitality >= 58)
      ? "✓ Sperm vitality normal.\n"
      : "⚠ Reduced sperm vitality.\n";


    // =========================
    // SPERM CONCENTRATION
    // =========================
    text += "\nSPERM CONCENTRATION:\n";

    if (spermCount >= 20) {
      text += "✓ Sperm concentration normal.\n";
    } else if (spermCount > 0) {
      text += "⚠ Oligozoospermia.\n";
    } else {
      text += "✗ Azoospermia.\n";
    }

    text += (totalSperm >= 40)
      ? "✓ Total sperm count adequate.\n"
      : "⚠ Low total sperm count.\n";

    if (wbcs < 1) {
      text += "✓ No leukocytospermia.\n";
    } else {
      text += "⚠ Leukocytospermia (possible infection).\n";
    }

    text += (immature < 5)
      ? "✓ Immature germ cells within normal limits.\n"
      : "⚠ Elevated immature germ cells.\n";

    if (rbcs && rbcs.toLowerCase() !== "none") {
      text += "⚠ Presence of RBCs detected.\n";
    } else {
      text += "✓ No RBCs detected.\n";
    }


    // =========================
    // MORPHOLOGY
    // =========================
    text += "\nMORPHOLOGY ANALYSIS:\n";

    if (normalMorph >= 4) {
      text += "✓ Normal morphology within WHO criteria.\n";
    } else if (normalMorph > 0) {
      text += "⚠ Teratozoospermia (abnormal morphology).\n";
    } else {
      text += "✗ Severe morphological defects.\n";
    }

    if (abnormalMorph > 0) {
      text += `ℹ Defect distribution: Head ${head}%, Mid ${mid}%, Tail ${tail}%, Tapered ${tapered}%.\n`;
    }


    // =========================
    // FINAL CLINICAL CLASSIFICATION
    // =========================
    const checks = [
      abstinence >= 2 && abstinence <= 5,
      ph >= 7.2,
      volume >= 1.5,
      liquefaction <= 30,
      motility >= 40,
      progressive >= 32,
      vitality >= 58,
      spermCount >= 20,
      normalMorph >= 4,
      wbcs < 1,
      immature < 5
    ];

    const score = checks.filter(Boolean).length;

    text += "\nOVERALL INTERPRETATION:\n";

    if (spermCount === 0) {
      text += "AZOOSPERMIA.\n";
    } else if (score >= 10) {
      text += "NORMOZOOSPERMIA.\n";
    } else if (score >= 7) {
      text += "MILD SEMINAL ABNORMALITIES.\n";
    } else if (score >= 5) {
      text += "MODERATE SEMINAL ABNORMALITIES.\n";
    } else {
      text += "SEVERE SEMINAL ABNORMALITIES.\n";
    }

    this.procedure.values['aiInterpretation'] = text;
  }
}
