import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appTextOnly]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TextOnly,
      multi: true
    }
  ]
})
export class TextOnly implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {

    const value = control.value;

    if (!value) {
      return null;
    }

    const valid = /^[A-Za-z\s]+$/.test(value);

    return valid ? null : { textOnly: true };
  }

}
