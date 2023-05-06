import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  @ViewChild('sells_report_chart') canvasRef!: ElementRef;

  constructor(
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected userAccountService: UserAccountService
  ) {}
  eventList: any[] = [];
  topSellers: any = undefined;
  public chart: Chart | undefined;

  ngOnInit(): void {
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

    this.eventService.getTopSellers().subscribe({
      next: value => {
        this.topSellers = value.body;
      },
      error: err => {
        console.error(err);
      },
    });
  }

  onGraphicTypeChange(type: string) {
    this.createSellsReportChart(type);
  }

  createSellsReportChart(graphicType: string) {
    switch (graphicType) {
      case this.GRAPHIC_TYPE_BARS:
        this.renderWithBarsGraphic();
        break;

      case this.GRAPHIC_TYPE_LINE:
        this.renderWithLineGraphic();
        break;
    }
  }

  private getTotalSellsGroupedByYearAndMonth(): any {
    return this.eventList.reduce((acc, item) => {
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
  }

  private renderWithLineGraphic() {
    this.chart?.destroy();
    const keys: any[] = Object.keys(this.topSellers);
    const values: any[] = Object.values(this.topSellers);
    this.chart = new Chart(this.canvasRef.nativeElement.getContext('2d'), {
      type: 'line',
      data: {
        labels: keys,
        datasets: [
          {
            label: 'Ganancias',
            data: values,
            backgroundColor: '#CEF394',
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  private renderWithBarsGraphic() {
    const groupedByYearAndMonthTotalSells = this.getTotalSellsGroupedByYearAndMonth();
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
