import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { EventService } from '../service/event.service';
import { AccountService } from '../../../core/auth/account.service';
import { UserAccountService } from '../../user-account/service/user-account.service';
import { Chart } from 'chart.js/auto';
import { TicketService } from '../../ticket/service/ticket.service';

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
  @ViewChild('sells_report_chart') sellsCanvasRef!: ElementRef;
  @ViewChild('assistants_report_chart') assistantsCanvasRef!: ElementRef;

  constructor(
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected userAccountService: UserAccountService,
    protected ticketService: TicketService
  ) {}

  currentViewMode = this.SELLS_REPORT;
  currentEvent: any;
  totalSelledTickets: number = 0;
  tickets: any[] = [];
  page = 1;
  pageSize = 10;
  public sellsReportChart: Chart | undefined;
  public assistantReportChart: Chart | undefined;

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
      this.createAssistantsReportList();
      this.createTicketsPerAssistantReport();
    }
  }

  createAssistantsReportList() {
    this.ticketService.findTicketsByEvent(this.currentEvent.id).subscribe(res => {
      this.tickets = res.body;
    });
  }

  onGraphicTypeChange(type: string) {
    if (this.currentViewMode === this.SELLS_REPORT) {
      this.createSellsReportChart(type);
    }
  }

  createTicketsPerAssistantReport() {
    this.assistantReportChart?.destroy();
    const { buyersLabelsDataSet, buyersTicketAmountDataSet } = this.getDataSetsForAssistantsReportChart();

    const hexBackgroundColors = ['#ffb4b4', '#e1c693', '#8dd0b3', '#ae7373', '#e4d3ff'];

    this.assistantReportChart = new Chart(this.assistantsCanvasRef.nativeElement.getContext('2d'), {
      type: 'pie',
      data: {
        labels: buyersLabelsDataSet,
        datasets: [
          {
            label: 'Entradas',
            data: buyersTicketAmountDataSet,
            backgroundColor: hexBackgroundColors,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  private getDataSetsForAssistantsReportChart() {
    const ticketsLeft = this.currentEvent.talTickets;
    const totalTickets = this.currentEvent.tickets.length + ticketsLeft;
    const allBuyersUserAccountIdsAndName = [
      ...new Set(
        this.tickets.map(ticket => `${ticket.userAccount.id}-${ticket.userAccount.user.firstName} ${ticket.userAccount.user.lastName}`)
      ),
    ];
    const buyersLabelsDataSet = [];
    const buyersTicketAmountDataSet = [];

    for (const buyerIdAndName of allBuyersUserAccountIdsAndName) {
      const buyerId = buyerIdAndName.split('-')[0];
      const buyerName = buyerIdAndName.split('-')[1];
      const buyerTickets = this.tickets.filter(x => x.userAccount.id === +buyerId);
      const buyerPercentageOfTickets = (buyerTickets.length / totalTickets) * 100;
      buyersLabelsDataSet.push(`${buyerName} - ${buyerPercentageOfTickets}%`);
      buyersTicketAmountDataSet.push(buyerTickets.length);
    }

    buyersLabelsDataSet.push(`Entradas sin vender - ${(ticketsLeft / totalTickets) * 100}%`);
    buyersTicketAmountDataSet.push(ticketsLeft);
    return { buyersLabelsDataSet, buyersTicketAmountDataSet };
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
    this.sellsReportChart?.destroy();
    const totalTickets = this.currentEvent.tickets.length + this.currentEvent.talTickets;
    const totalSelledTicketsPercentage = (this.currentEvent.tickets.length / totalTickets) * 100;
    const totalUnselledTicketsPercentage = (this.currentEvent.talTickets / totalTickets) * 100;
    this.sellsReportChart = new Chart(this.sellsCanvasRef.nativeElement.getContext('2d'), {
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
    this.sellsReportChart?.destroy();
    console.log(dateRanges);
    console.log(profitsGroupedByDate);
    console.log(selledTicketsGroupedByDate);
    this.sellsReportChart = new Chart(this.sellsCanvasRef.nativeElement.getContext('2d'), {
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
    this.sellsReportChart?.destroy();
    this.sellsReportChart = new Chart(this.sellsCanvasRef.nativeElement.getContext('2d'), {
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
