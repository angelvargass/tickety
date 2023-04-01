import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserAccountService } from '../../user-account/service/user-account.service';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';
import { OrganizationService } from '../service/organization.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from '../../../config/error.constants';

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
  errorOrgDoesNotExists = false;
  userIdentity: Account | null = null;
  success: boolean = false;

  constructor(
    private userAccountService: UserAccountService,
    private accountService: AccountService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserIdentity();
  }

  getCurrentUserIdentity() {
    this.accountService.getAuthenticationState().subscribe(x => (this.userIdentity = x));
    this.checkForCurrentUserOrganization();
  }

  checkForCurrentUserOrganization() {
    if (!this.userIdentity?.userAccount?.organization) {
      this.errorOrgDoesNotExists = true;
    }
  }

  register(): void {
    this.error = false;
    this.errorEmailExists = false;
    const { email } = this.registerForm.getRawValue();
    const currentUserOrganizationId = this.userIdentity?.userAccount?.organization?.id;
    this.organizationService.invitePromoterToOrganization(currentUserOrganizationId!, email).subscribe(
      x => (this.success = true),
      error => this.processError(error)
    );
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.errorKey === 'already exists') {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
