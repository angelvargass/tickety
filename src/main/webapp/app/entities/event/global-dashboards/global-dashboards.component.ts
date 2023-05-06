import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { EventService } from '../service/event.service';
import { AccountService } from '../../../core/auth/account.service';
import { UserAccountService } from '../../user-account/service/user-account.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: '[jhi-event-dashboard]',
  templateUrl: './global-dashboards.component.html',
  styleUrls: ['./global-dashboards.component.scss'],
})
export class GlobalDashboardsComponent implements OnInit {
  protected readonly SELLS_REPORT = 'SELLS_REPORT';
  //TODO: ADD MORE REPORTS HERE

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
  eventList: any[] = [];
  public chart: Chart | undefined;

  ngOnInit(): void {
    this.currentEvent = undefined;

    this.initInfo();
  }

  initInfo() {
    this.eventService.query().subscribe({
      next: value => {
        this.eventList = value.body as any[];
        this.createSellsReportChart(this.GRAPHIC_TYPE_BARS);
      },
      error: err => {
        console.error(err);
      },
    });
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

  createSellsReportChart(graphicType: string) {
    const groupedByYearAndMonthTotalSells = this.getTotalSellsgroupByYearAndMonth();

    switch (graphicType) {
      case this.GRAPHIC_TYPE_BARS:
        this.renderWithBarsGraphic(groupedByYearAndMonthTotalSells);
        break;

      case this.GRAPHIC_TYPE_LINE:
        //this.renderWithLineGraphic(dateRanges, profitsGroupedByDate, selledTicketsGroupedByDate);
        break;

      case this.GRAPHIC_TYPE_PIE:
        //this.renderWithPieGraphic();
        break;
    }
  }

  private getTotalSellsgroupByYearAndMonth(): any {
    const groupedByYearAndMonth = this.eventList.reduce((acc, item) => {
      const dateParts = item.creationDate.split('-');
      const year = dateParts[0];
      const month = dateParts[1];
      const tickets = item.tickets;

      if (!acc[year + '-' + month]) {
        acc[year + '-' + month] = {
          numberOfEvents: 0,
          totalSelledTickets: 0,
          totalTicketsProfit: 0,
        };
      }
      const totalTicketsProfit = tickets.reduce((acc: number, ticket: any) => acc + ticket.amount, 0);

      acc[year + '-' + month].numberOfEvents += 1;
      acc[year + '-' + month].totalSelledTickets += tickets.length;
      acc[year + '-' + month].totalTicketsProfit += totalTicketsProfit;

      return acc;
    }, {});

    return groupedByYearAndMonth;
  }

  private renderWithLineGraphic(dateRanges: any[], profitsGroupedByDate: any[], selledTicketsGroupedByDate: any[]) {
    this.chart?.destroy();
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

  private renderWithBarsGraphic(groupedByYearAndMonthTotalSells: any) {
    this.chart?.destroy();
    const dates: any[] = Object.keys(groupedByYearAndMonthTotalSells);
    const values: any[] = Object.values(groupedByYearAndMonthTotalSells);
    const numberOfEvents = values.map(({ numberOfEvents }) => numberOfEvents);
    const totalSelledTickets = values.map(({ totalSelledTickets }) => totalSelledTickets);
    const totalTicketsProfit = values.map(({ totalTicketsProfit }) => totalTicketsProfit);
    this.chart = new Chart(this.canvasRef.nativeElement.getContext('2d'), {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Número de eventos',
            data: numberOfEvents,
            backgroundColor: '#F39494',
          },
          {
            label: 'Total de tickets vendidos',
            data: totalSelledTickets,
            backgroundColor: '#94B5F3',
          },
          {
            label: 'Total de dinero recaudado',
            data: totalTicketsProfit,
            backgroundColor: '#CEF394',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
