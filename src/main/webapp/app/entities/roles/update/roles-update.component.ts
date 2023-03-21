import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RolesFormService, RolesFormGroup } from './roles-form.service';
import { IRoles } from '../roles.model';
import { RolesService } from '../service/roles.service';
import { IUserAccount } from 'app/entities/user-account/user-account.model';
import { UserAccountService } from 'app/entities/user-account/service/user-account.service';

@Component({
  selector: 'jhi-roles-update',
  templateUrl: './roles-update.component.html',
})
export class RolesUpdateComponent implements OnInit {
  isSaving = false;
  roles: IRoles | null = null;

  userAccountsSharedCollection: IUserAccount[] = [];

  editForm: RolesFormGroup = this.rolesFormService.createRolesFormGroup();

  constructor(
    protected rolesService: RolesService,
    protected rolesFormService: RolesFormService,
    protected userAccountService: UserAccountService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserAccount = (o1: IUserAccount | null, o2: IUserAccount | null): boolean => this.userAccountService.compareUserAccount(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roles }) => {
      this.roles = roles;
      if (roles) {
        this.updateForm(roles);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const roles = this.rolesFormService.getRoles(this.editForm);
    if (roles.id !== null) {
      this.subscribeToSaveResponse(this.rolesService.update(roles));
    } else {
      this.subscribeToSaveResponse(this.rolesService.create(roles));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoles>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(roles: IRoles): void {
    this.roles = roles;
    this.rolesFormService.resetForm(this.editForm, roles);

    this.userAccountsSharedCollection = this.userAccountService.addUserAccountToCollectionIfMissing<IUserAccount>(
      this.userAccountsSharedCollection,
      roles.userAccount
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userAccountService
      .query()
      .pipe(map((res: HttpResponse<IUserAccount[]>) => res.body ?? []))
      .pipe(
        map((userAccounts: IUserAccount[]) =>
          this.userAccountService.addUserAccountToCollectionIfMissing<IUserAccount>(userAccounts, this.roles?.userAccount)
        )
      )
      .subscribe((userAccounts: IUserAccount[]) => (this.userAccountsSharedCollection = userAccounts));
  }
}
