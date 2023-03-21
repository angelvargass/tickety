import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGalery, NewGalery } from '../galery.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGalery for edit and NewGaleryFormGroupInput for create.
 */
type GaleryFormGroupInput = IGalery | PartialWithRequiredKeyOf<NewGalery>;

type GaleryFormDefaults = Pick<NewGalery, 'id'>;

type GaleryFormGroupContent = {
  id: FormControl<IGalery['id'] | NewGalery['id']>;
  name: FormControl<IGalery['name']>;
  status: FormControl<IGalery['status']>;
};

export type GaleryFormGroup = FormGroup<GaleryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GaleryFormService {
  createGaleryFormGroup(galery: GaleryFormGroupInput = { id: null }): GaleryFormGroup {
    const galeryRawValue = {
      ...this.getFormDefaults(),
      ...galery,
    };
    return new FormGroup<GaleryFormGroupContent>({
      id: new FormControl(
        { value: galeryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(galeryRawValue.name),
      status: new FormControl(galeryRawValue.status),
    });
  }

  getGalery(form: GaleryFormGroup): IGalery | NewGalery {
    return form.getRawValue() as IGalery | NewGalery;
  }

  resetForm(form: GaleryFormGroup, galery: GaleryFormGroupInput): void {
    const galeryRawValue = { ...this.getFormDefaults(), ...galery };
    form.reset(
      {
        ...galeryRawValue,
        id: { value: galeryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GaleryFormDefaults {
    return {
      id: null,
    };
  }
}
