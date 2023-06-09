import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITicket, NewTicket } from '../ticket.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITicket for edit and NewTicketFormGroupInput for create.
 */
type TicketFormGroupInput = ITicket | PartialWithRequiredKeyOf<NewTicket>;

type TicketFormDefaults = Pick<NewTicket, 'id'>;

type TicketFormGroupContent = {
  id: FormControl<ITicket['id'] | NewTicket['id']>;
  date: FormControl<ITicket['date']>;
  ticketStatus: FormControl<ITicket['ticketStatus']>;
  payment: FormControl<ITicket['payment']>;
  amount: FormControl<ITicket['amount']>;
  seat: FormControl<ITicket['seat']>;
  userAccount: FormControl<ITicket['userAccount']>;
  event: FormControl<ITicket['event']>;
};

export type TicketFormGroup = FormGroup<TicketFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TicketFormService {
  createTicketFormGroup(ticket: TicketFormGroupInput = { id: null }): TicketFormGroup {
    const ticketRawValue = {
      ...this.getFormDefaults(),
      ...ticket,
    };
    return new FormGroup<TicketFormGroupContent>({
      id: new FormControl(
        { value: ticketRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(ticketRawValue.date),
      ticketStatus: new FormControl(ticketRawValue.ticketStatus),
      payment: new FormControl(ticketRawValue.payment),
      amount: new FormControl(ticketRawValue.amount),
      seat: new FormControl(ticketRawValue.seat),
      userAccount: new FormControl(ticketRawValue.userAccount),
      event: new FormControl(ticketRawValue.event),
    });
  }

  getTicket(form: TicketFormGroup): ITicket | NewTicket {
    return form.getRawValue() as ITicket | NewTicket;
  }

  resetForm(form: TicketFormGroup, ticket: TicketFormGroupInput): void {
    const ticketRawValue = { ...this.getFormDefaults(), ...ticket };
    form.reset(
      {
        ...ticketRawValue,
        id: { value: ticketRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TicketFormDefaults {
    return {
      id: null,
    };
  }
}
