import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGalery } from '../galery.model';

@Component({
  selector: 'jhi-galery-detail',
  templateUrl: './galery-detail.component.html',
  styleUrls: ['./galery-detail.component.scss'],
})
export class GaleryDetailComponent implements OnInit {
  galery: IGalery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ galery }) => {
      this.galery = galery;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
