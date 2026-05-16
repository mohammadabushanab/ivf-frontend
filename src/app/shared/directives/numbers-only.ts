import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appNumbersOnly]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NumbersOnly,
      multi: true
    }
  ]
})
export class NumbersOnly implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {

    if (!control.value) {
      return null;
    }

    const valid = /^[0-9]+$/.test(control.value);

    return valid ? null : { numbersOnly: true };

  }

}
