import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTicketsComponent } from './modal-tickets.component';

describe('ModalTicketsComponent', () => {
  let component: ModalTicketsComponent;
  let fixture: ComponentFixture<ModalTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalTicketsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
