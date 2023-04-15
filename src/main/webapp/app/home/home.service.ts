import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../core/config/application-config.service';
import { IContact } from '../entities/contact/contact.model';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/contact-info');

  constructor(private http: HttpClient, private router: Router, private applicationConfigService: ApplicationConfigService) {}

  sendContactForm(contactForm: any) {
    return this.http.post<any>(this.resourceUrl, contactForm, { observe: 'response' });
  }
}
