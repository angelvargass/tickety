import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'jhi-invite-promoter',
  templateUrl: './invite-promoter.component.html',
  styleUrls: ['./invite-promoter.component.scss'],
})
export class InvitePromoterComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
  });

  error = false;
  errorEmailExists = false;

  constructor() {}

  ngOnInit(): void {}

  register(): void {
    // this.error = false;
    // this.errorEmailExists = false;
    //
    // const {email} = this.registerForm.getRawValue();
    //
    //
    // this.registerService
    //   .save({login, firstName, lastName, email, password, langKey: this.translateService.currentLang, genderu})
    //   .subscribe({next: () => (this.success = true), error: response => this.processError(response)});
  }
}
