import { ValidatorFn, AbstractControl } from '@angular/forms';

export function RegExValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const result = nameRe.test(control.value);
    return result ? null : {'regEx-MisMatch': {value: control.value}};
  };
}
