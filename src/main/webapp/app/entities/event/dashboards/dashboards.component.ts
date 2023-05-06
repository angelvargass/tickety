import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { EventService } from '../service/event.service';
import { AccountService } from '../../../core/auth/account.service';
import { UserAccountService } from '../../user-account/service/user-account.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: '[jhi-event-dashboard]',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent implements OnInit, AfterViewInit {
  protected readonly SELLS_REPORT = 'SELLS_REPORT';
  protected readonly ASSISTANTS_REPORT = 'ASSISTANTS_REPORT';
  @ViewChild('sells_report_chart') canvasRef!: ElementRef;

  constructor(
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected userAccountService: UserAccountService
  ) {}

  currentViewMode = this.SELLS_REPORT;
  currentEvent: any;
  totalSelledTickets: number = 0;
  public chart: any;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.currentEvent = event;
    });

    this.initInfo();
  }

  initInfo() {
    this.totalSelledTickets = this.currentEvent.tickets.length;
  }

  changeViewMode(viewMode: any) {
    this.currentViewMode = viewMode;

    if (viewMode === this.SELLS_REPORT) {
      this.createSellsReportChart();
    } else {
    }
  }

  ngAfterViewInit(): void {
    this.createSellsReportChart();
  }

  createSellsReportChart() {
    let currentDate = new Date(this.currentEvent.creationDate);
    const endDate = new Date(this.currentEvent.date);
    const dateRanges: any[] = [];

    while (currentDate <= endDate) {
      dateRanges.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const [selledTicketsGroupedByDate, profitsGroupedByDate] = this.getGroupedValuesByDate(dateRanges, this.currentEvent.tickets);
    this.chart = new Chart(this.canvasRef.nativeElement.getContext('2d'), {
      type: 'bar',
      data: {
        labels: dateRanges,
        datasets: [
          {
            label: 'Tickets',
            data: selledTicketsGroupedByDate,
            backgroundColor: '#F39494',
          },
          {
            label: 'Ganancias',
            data: profitsGroupedByDate,
            backgroundColor: '#94B5F3',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  private getGroupedValuesByDate(dateRanges: any[], tickets: any[]) {
    const selledTicketsGroupedByDate = [];
    const profitsGroupedByDate = [];
    for (const date of dateRanges) {
      const ticketsByDate = tickets.filter(x => x.date === date);
      selledTicketsGroupedByDate.push(ticketsByDate.length);

      if (ticketsByDate.length !== 0) {
        console.log(selledTicketsGroupedByDate);
        // @ts-ignore
        const totalAmount = ticketsByDate.reduce((acc, ticket) => acc + ticket.amount, 0);
        profitsGroupedByDate.push(totalAmount);
      } else {
        profitsGroupedByDate.push(0);
      }
    }

    return [selledTicketsGroupedByDate, profitsGroupedByDate];
  }
}
