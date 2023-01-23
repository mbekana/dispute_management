import { UntypedFormGroup } from '@angular/forms';
    
export function ConfirmeValidator(controlName: string, matchingControlName: string){
    return (formGroup: UntypedFormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmeValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmeValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}