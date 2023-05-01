import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEvent, NewEvent } from '../event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvent for edit and NewEventFormGroupInput for create.
 */
type EventFormGroupInput = IEvent | PartialWithRequiredKeyOf<NewEvent>;

type EventFormDefaults = Pick<NewEvent, 'id'>;

type EventFormGroupContent = {
  id: FormControl<IEvent['id'] | NewEvent['id']>;
  date: FormControl<IEvent['date']>;
  eventSatus: FormControl<IEvent['eventSatus']>;
  talTickets: FormControl<IEvent['talTickets']>;
  eventPrice: FormControl<IEvent['eventPrice']>;
  eventName: FormControl<IEvent['eventName']>;
  eventDescription: FormControl<IEvent['eventDescription']>;
  galery: FormControl<IEvent['galery']>;
  userAccount: FormControl<IEvent['userAccount']>;
  organization: FormControl<IEvent['organization']>;
  venue: FormControl<IEvent['venue']>;
};

export type EventFormGroup = FormGroup<EventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventFormService {
  createEventFormGroup(event: EventFormGroupInput = { id: null }): EventFormGroup {
    const eventRawValue = {
      ...this.getFormDefaults(),
      ...event,
    };
    return new FormGroup<EventFormGroupContent>({
      id: new FormControl(
        { value: eventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(eventRawValue.date),
      eventSatus: new FormControl(eventRawValue.eventSatus),
      talTickets: new FormControl(eventRawValue.talTickets, {
        validators: [Validators.min(0)],
      }),
      eventPrice: new FormControl(eventRawValue.eventPrice),
      eventName: new FormControl(eventRawValue.eventName),
      eventDescription: new FormControl(eventRawValue.eventDescription),
      galery: new FormControl(eventRawValue.galery),
      userAccount: new FormControl(eventRawValue.userAccount),
      organization: new FormControl(eventRawValue.organization),
      venue: new FormControl(eventRawValue.venue),
    });
  }

  getEvent(form: EventFormGroup): IEvent | NewEvent {
    return form.getRawValue() as IEvent | NewEvent;
  }

  resetForm(form: EventFormGroup, event: EventFormGroupInput): void {
    const eventRawValue = { ...this.getFormDefaults(), ...event };
    form.reset(
      {
        ...eventRawValue,
        id: { value: eventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EventFormDefaults {
    return {
      id: null,
    };
  }
}
