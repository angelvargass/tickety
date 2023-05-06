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
  protected readonly GRAPHIC_TYPE_LINE = 'line';
  protected readonly GRAPHIC_TYPE_BARS = 'bar';
  protected readonly GRAPHIC_TYPE_PIE = 'pie';
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
  public chart: Chart | undefined;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.currentEvent = event;
    });

    this.initInfo();
  }

  ngAfterViewInit(): void {
    this.createSellsReportChart(this.GRAPHIC_TYPE_BARS);
  }

  initInfo() {
    this.totalSelledTickets = this.currentEvent.tickets.length;
  }

  changeViewMode(viewMode: any) {
    this.currentViewMode = viewMode;

    if (viewMode === this.SELLS_REPORT) {
      this.createSellsReportChart(this.GRAPHIC_TYPE_BARS);
    } else {
    }
  }

  onGraphicTypeChange(type: string) {
    this.createSellsReportChart(type);
  }

  private getDateRangesForDatasets() {
    let currentDate = new Date(this.currentEvent.creationDate);
    const endDate = new Date(this.currentEvent.date);
    const dateRanges: any[] = [];

    while (currentDate <= endDate) {
      dateRanges.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRanges;
  }

  createSellsReportChart(graphicType: string) {
    const dateRanges = this.getDateRangesForDatasets();
    const [selledTicketsGroupedByDate, profitsGroupedByDate] = this.getGroupedValuesByDate(dateRanges, this.currentEvent.tickets);

    switch (graphicType) {
      case this.GRAPHIC_TYPE_BARS:
        this.renderWithBarsGraphic(dateRanges, selledTicketsGroupedByDate, profitsGroupedByDate);
        break;

      case this.GRAPHIC_TYPE_LINE:
        this.renderWithLineGraphic(dateRanges, profitsGroupedByDate, selledTicketsGroupedByDate);
        break;

      case this.GRAPHIC_TYPE_PIE:
        this.renderWithPieGraphic();
        break;
    }
  }

  private renderWithPieGraphic() {
    this.chart?.destroy();
    const totalTickets = this.currentEvent.tickets.length + this.currentEvent.talTickets;
    const totalSelledTicketsPercentage = (this.currentEvent.tickets.length / totalTickets) * 100;
    const totalUnselledTicketsPercentage = (this.currentEvent.talTickets / totalTickets) * 100;
    this.chart = new Chart(this.canvasRef.nativeElement.getContext('2d'), {
      type: 'pie',
      data: {
        labels: [`Entradas vendidas ${totalSelledTicketsPercentage}%`, `Entradas sin vender ${totalUnselledTicketsPercentage}%`],
        datasets: [
          {
            label: 'Inventario de entradas',
            data: [this.currentEvent.tickets.length, this.currentEvent.talTickets],
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  private renderWithLineGraphic(dateRanges: any[], profitsGroupedByDate: any[], selledTicketsGroupedByDate: any[]) {
    this.chart?.destroy();
    console.log(dateRanges);
    console.log(profitsGroupedByDate);
    console.log(selledTicketsGroupedByDate);
    this.chart = new Chart(this.canvasRef.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: dateRanges,
        datasets: [
          {
            label: 'Ganancias',
            data: profitsGroupedByDate,
            backgroundColor: '#94B5F3',
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Tickets',
            data: selledTicketsGroupedByDate,
            backgroundColor: '#F39494',
            borderColor: '#F39494',
            tension: 0.1,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  private renderWithBarsGraphic(dateRanges: any[], selledTicketsGroupedByDate: any[], profitsGroupedByDate: any[]) {
    this.chart?.destroy();
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
