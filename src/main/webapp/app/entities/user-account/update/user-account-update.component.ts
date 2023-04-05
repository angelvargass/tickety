import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserAccountFormGroup, UserAccountFormService } from './user-account-form.service';
import { IUserAccount } from '../user-account.model';
import { UserAccountService } from '../service/user-account.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { Gender } from 'app/entities/enumerations/gender.model';
import { AccountService } from '../../../core/auth/account.service';
import { Authority } from '../../../config/authority.constants';

@Component({
  selector: 'jhi-user-account-update',
  templateUrl: './user-account-update.component.html',
  styleUrls: ['/user-account-update.component.scss'],
})
export class UserAccountUpdateComponent implements OnInit {
  isSaving = false;
  userAccount: IUserAccount | null = null;
  genderValues = Object.keys(Gender);
  userAuthorities: any[] | undefined = [];
  protected readonly VIEWMODE_PREFERENCES = 'PREFERENCES';
  protected readonly DEFAULT_VIEWMODE = this.VIEWMODE_PREFERENCES;

  currentViewMode: string = this.DEFAULT_VIEWMODE;

  organizationsSharedCollection: IOrganization[] = [];

  editForm: UserAccountFormGroup = this.userAccountFormService.createUserAccountFormGroup();

  constructor(
    protected userAccountService: UserAccountService,
    protected userAccountFormService: UserAccountFormService,
    protected organizationService: OrganizationService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  compareOrganization = (o1: IOrganization | null, o2: IOrganization | null): boolean =>
    this.organizationService.compareOrganization(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userAccount }) => {
      this.userAccount = userAccount;
      if (userAccount) {
        this.updateForm(userAccount);
      }

      this.loadRelationshipsOptions();
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.userAuthorities = account?.authorities;
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userAccount = this.userAccountFormService.getUserAccount(this.editForm);
    if (userAccount.id !== null) {
      this.subscribeToSaveResponse(this.userAccountService.partialUpdate(userAccount));
    } else {
      this.subscribeToSaveResponse(this.userAccountService.create(userAccount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserAccount>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.router.navigate(['']);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userAccount: IUserAccount): void {
    this.userAccount = userAccount;
    this.userAccountFormService.resetForm(this.editForm, userAccount);

    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(
      this.organizationsSharedCollection,
      userAccount.organization
    );
  }

  protected loadRelationshipsOptions(): void {
    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(organizations, this.userAccount?.organization)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));
  }

  changeViewMode(viewMode: string): void {}

  userHasOnlyUserRole(): boolean | undefined {
    return this.userAuthorities?.includes((x: string) => x === Authority.USER) && this.userAuthorities?.length === 1;
  }

  userHasOrganizationOrPromoterRole(): boolean | undefined {
    return this.userAuthorities?.includes(Authority.ORGANIZATION || Authority.PROMOTER);
  }
}
