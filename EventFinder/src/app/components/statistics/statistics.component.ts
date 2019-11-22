import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth.service';
import { Feedback } from 'src/app/components/statistics/feedback.enum';
import { EventService } from 'src/app/services/event.service';
import { Organization } from 'src/app/models/account.model';
import { Event } from 'src/app/models/event.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent implements OnInit {
  orgEventList: Event[] = [];

  private mockFeedback: Feedback[] = [
    {uid: 'string',
      useruid: 'string',
      eventuid: 'string',
      organizationuid: 'string',
      rating: 5,
      review: 'string',
      created: new Date(Date.now())},
      {uid: 'string',
      useruid: 'string',
      eventuid: 'string',
      organizationuid: 'string',
      rating: 1,
      review: 'string',
      created: new Date(Date.now())},
      {uid: 'string',
      useruid: 'string',
      eventuid: 'string',
      organizationuid: 'string',
      rating: 4,
      review: 'string',
      created: new Date(Date.now())},
      {uid: 'string',
      useruid: 'string',
      eventuid: 'string',
      organizationuid: 'string',
      rating: 5,
      review: 'string',
      created: new Date(Date.now())},
      {uid: 'string',
      useruid: 'string',
      eventuid: 'string',
      organizationuid: 'string',
      rating: 4,
      review: 'string',
      created: new Date(Date.now())},
      {uid: 'string',
      useruid: 'string',
      eventuid: 'string',
      organizationuid: 'string',
      rating: 2,
      review: 'string',
      created: new Date(Date.now())},
  ];
  public loading = true;

  // General pie chart formatting
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
      labels: { fontColor: 'rgba(255, 255, 255)' }
    },
    elements: {
      arc: {
        borderColor: 'rgba(50, 50, 89,1)',
        borderWidth: 7},
      line: {
        borderColor: 'rgba(50, 50, 89,1)',
        borderWidth: 7
      }},
    hover: {mode: null},
  };

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(67,205,119,0.8)', 'rgba(208,91,91,0.8)'],
    },
  ];

  // Overall rating pie data
  public overallRatingPieChartLabels: Label[] = ['Good Reviews', 'Bad Reviews'];
  public overallRatingPieChartData;

  // Segregation pie data
  public segregationPieChartLabels: Label[] = ['Male', 'Female'];
  public segregationPieChartData;
  public segregationPieChartColors = [
    {
      backgroundColor: ['rgba(67,205,119,0.8)', 'rgba(208,91,91,0.8)'],
    },
  ];

  // Geo pie data
  public geoPieChartLabels: Label[] = ['9000 Aalborg C', '9200 Aalborg SV', '9220 Aalborg Ø', '8000 Aarhus C', 'Other'];
  public geoPieChartData;
  public geoPieChartColors = [
    {
      backgroundColor: ['rgba(65, 135, 151)', 'rgba(52, 117, 177)', 'rgba(173, 79, 115)', 'rgba(173, 144, 88)', 'rgba(159, 160, 178)' ]
    },
  ];

  constructor(public auth: AuthService, private eventService: EventService) {
    this.loadData();
  }

  ngOnInit() {
    this.eventService.getEvents(100).subscribe(result => {
      for (const collection of result) {
        const event = collection.payload.doc.data() as Event;

        if (event.organizationId === this.auth.selectedOrganizationUid) {
          this.orgEventList.push(event);
        }
      }
    });
  }

  onClickTest() {
    this.overallRatingPieChartData = [50, 50];
  }

  loadData() {
    this.overallRatingPieChartData = this.getTotalRatings(this.mockFeedback);
    this.segregationPieChartData = [47, 53];
    this.geoPieChartData = [292, 210, 144, 92, 15];
    setTimeout(() => this.loading = false, 500);
  }

  getTotalRatings(mockFeedback: Feedback[]) {
    const reviewResults = [0, 0];

    mockFeedback.forEach(feedback => {
      if (feedback.rating > 2) {
        reviewResults[0]++;
      } else {
        reviewResults[1]++;
      }
    });

    return reviewResults;
  }
}
