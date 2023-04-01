import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { OrganizationFormService, OrganizationFormGroup } from './organization-form.service';
import { IOrganization } from '../organization.model';
import { OrganizationService } from '../service/organization.service';
import { IContact } from 'app/entities/contact/contact.model';
import { ContactService } from 'app/entities/contact/service/contact.service';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-organization-update',
  templateUrl: './organization-update.component.html',
  styleUrls: ['./organization-update.component.scss'],
})
export class OrganizationUpdateComponent implements OnInit {
  isSaving = false;
  organization: IOrganization | null = null;

  contactsCollection: IContact[] = [];

  editForm: OrganizationFormGroup = this.organizationFormService.createOrganizationFormGroup();

  constructor(
    protected organizationService: OrganizationService,
    protected organizationFormService: OrganizationFormService,
    protected contactService: ContactService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  compareContact = (o1: IContact | null, o2: IContact | null): boolean => this.contactService.compareContact(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organization }) => {
      this.organization = organization;
      if (organization) {
        this.updateForm(organization);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    this.router.navigate(['']);
  }

  save(): void {
    this.isSaving = true;
    const organization = this.organizationFormService.getOrganization(this.editForm);
    if (organization.id !== null) {
      this.subscribeToSaveResponse(this.organizationService.update(organization));
    } else {
      this.subscribeToSaveResponse(this.organizationService.create(organization));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganization>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    const organization = this.organizationFormService.getOrganization(this.editForm);
    if (organization.id === null) {
      this.router.navigate(['contact/new']);
    }

    //Set organization role since we are gonna need it in the next view
    this.accountService.identity().subscribe(
      account => {
        account?.authorities.push('ROLE_ORGANIZATION');
      },
      error => {
        this.router.navigate(['']);
      }
    );
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(organization: IOrganization): void {
    this.organization = organization;
    this.organizationFormService.resetForm(this.editForm, organization);

    this.contactsCollection = this.contactService.addContactToCollectionIfMissing<IContact>(this.contactsCollection, organization.contact);
  }

  protected loadRelationshipsOptions(): void {
    this.contactService
      .query({ filter: 'organization-is-null' })
      .pipe(map((res: HttpResponse<IContact[]>) => res.body ?? []))
      .pipe(
        map((contacts: IContact[]) => this.contactService.addContactToCollectionIfMissing<IContact>(contacts, this.organization?.contact))
      )
      .subscribe((contacts: IContact[]) => (this.contactsCollection = contacts));
  }
}
