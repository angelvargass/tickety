import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { EventService } from '../entities/event/service/event.service';
import { IEvent } from '../entities/event/event.model';
import { IGalery } from '../entities/galery/galery.model';
import { IPhoto } from '../entities/photo/photo.model';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeService } from './home.service';
declare var $: any;

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  @ViewChildren('div[class*="carousel-inner"]') carouselInner!: ElementRef;

  contactFormGroup = new FormGroup({
    name: new FormControl({}, { validators: [Validators.required] }),
    email: new FormControl({}, { validators: [Validators.required, Validators.email] }),
    phone: new FormControl({}),
    message: new FormControl({}, { validators: [Validators.required] }),
  });

  carouselWidth: number = 0;
  cardWidth: number = 0;
  scrollPosition = 0;
  carouselItems: any[] = [];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private eventService: EventService,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.eventService.query().subscribe({
      next: response => {
        this.carouselItems = response.body as any[];
      },
      error: err => {
        console.error(err);
      },
    });

    this.eventService.query('id').subscribe({
      next: response => {
        this.setShowCase(<IEvent[]>response.body);
      },
      error: err => {
        console.log(err);
      },
    });

    this.ngAfterViewInit();
  }

  // this function set the showcase (image that will be display on the vent card)
  setShowCase(eventList: IEvent[]): void {
    eventList.forEach(ev => {
      let tmpGaleria = <IGalery>ev.galery;
      let tmpPhotos = <IPhoto[]>(<unknown>tmpGaleria.photos);
      // Modify to pick the favorite
      ev.showCase = tmpPhotos[0].url;
      this.carouselItems.push(<IEvent>ev);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.carouselWidth = $(`div[class*="carousel-inner"]`)[0].scrollWidth;
    this.cardWidth = $('.carousel-item').width();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  nextCarouselSlide(carouselNumber: number) {
    if (this.scrollPosition < this.carouselWidth - this.cardWidth * 4) {
      //check if you can go any further
      this.scrollPosition += this.cardWidth; //update scroll position
      $(`.carousel-inner${carouselNumber}`).animate({ scrollLeft: this.scrollPosition }, 600); //scroll left
    }
  }

  prevCarouselSlide(carouselNumber: number) {
    if (this.scrollPosition > 0) {
      this.scrollPosition -= this.cardWidth;
      $(`.carousel-inner${carouselNumber}`).animate({ scrollLeft: this.scrollPosition }, 600);
    }
  }

  submitContactForm() {
    const contactFormModel = this.contactFormGroup.getRawValue();
    this.homeService.sendContactForm(contactFormModel).subscribe(x => {
      this.contactFormGroup.reset();
    });
  }
}
