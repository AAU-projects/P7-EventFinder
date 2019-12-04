import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';
import { EventService } from 'src/app/services/event.service';
import { AccountService } from 'src/app/services/account.service';
import { Event } from 'src/app/models/event.model';
import { GraphData } from 'src/app/components/statistics/graph-data.enum';
import { User } from 'src/app/models/account.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { RecommenderService } from 'src/app/services/recommender.service';
import { RadarChart, PieChart, BarChart } from 'src/app/components/statistics/graphs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  // References to the HTML chart objects
  @ViewChild('currentChart', { static: false })
  @ViewChild('radarChart', { static: false })
  currentChart: BaseChartDirective;
  radarChart: BaseChartDirective;

  orgEventList = {};
  selectedEvent: string;
  selectedData: string;
  public loading = true;

  userListSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);
  public userListObs: Observable<User[]> = this.userListSubject.asObservable();

  recommendationsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public recommendationsObs: Observable<any[]> = this.recommendationsSubject.asObservable();

  get graphData() { return GraphData; }

  // Currently selected chart
  public currentChartObject = new PieChart();
  // Radar chart for selected event
  public radarChartObject = new RadarChart();
  // Overall rating
  public overallRatingChartObject = new PieChart();
  // Overall segregation
  public overallSegregationChartObject = new PieChart();
  // Overall geolocation
  public overallGeoChartObject = new PieChart();
  // Overall user preferences
  public overallPreferenceChartObject = new RadarChart();
  // Overall cost attendency
  public overallCostAttendencyChartObject = new BarChart();

  constructor(
    public auth: AuthService,
    private eventService: EventService,
    private feedbackService: FeedbackService,
    private accountService: AccountService,
    private recommenderService: RecommenderService
  ) {}

  ngOnInit() {
    const sub = this.eventService
      .getAllEventsFromOrganizer(this.auth.selectedOrganizationUid)
      .subscribe(result => {
        for (const collection of result) {
          const event = collection.payload.doc.data() as Event;
          this.orgEventList[event.uid] = event;
        }
        // Set initial selected event and selected data.
        this.selectedEvent = Object.keys(this.orgEventList)[0];
        this.selectedData = GraphData.Rating;

        // Loads initial data, and sets temp data for hidden charts.
        this.loadData();
        sub.unsubscribe();
      });
  }

  // Initialize selected Chart settings
  loadData() {
    // Gets the initial data for the graphs.
    this.initializeGraphs();

    this.currentChartObject.labels = ['Good Reviews', 'Bad Reviews'];
    this.currentChartObject.colors = [{ backgroundColor: ['rgba(67,205,119,0.8)', 'rgba(208,91,91,0.8)'] }];
    // Sets temp data and labels for the hidden radar chart.
    this.radarChartObject.labels = ['Loading', 'Data'];
    this.radarChartObject.data = [1, 0];

    setTimeout(() => (this.loading = false), 1000);
  }

  initializeGraphs() {
    let feedbackList;
    let overallFeedbackList;

    // Initialize event staticstics chart
    const eventSub = this.feedbackService
      .getFeedbackFromEvent(this.selectedEvent, 100)
      .subscribe(items => {
        feedbackList = items;
        this.getTotalRatings(feedbackList, this.currentChartObject);
        eventSub.unsubscribe();
      });

    // Initialize overall charts
    const overallSub = this.feedbackService
      .getFeedbackFromOrganization(this.auth.selectedOrganizationUid)
      .subscribe(items => {
        overallFeedbackList = items;
        this.getTotalRatings(overallFeedbackList, this.overallRatingChartObject);
        this.getGenderSegregation(overallFeedbackList, this.overallSegregationChartObject);
        this.getGeographicalSegmentation(overallFeedbackList, this.overallGeoChartObject);
        this.getUserPreferences(overallFeedbackList, this.overallPreferenceChartObject);
        this.getCostAttendency(this.overallCostAttendencyChartObject);
        overallSub.unsubscribe();
      });
  }

  getTotalRatings(feedbackList: Feedback[], pieChart: PieChart) {
    const reviewResults = [0, 0];

    // Will be changed if data is found.
    pieChart.data = [0];
    pieChart.labels = ['No data'];

    feedbackList.forEach(feedback => {
      if (feedback.rating > 2) {
        reviewResults[0]++;
      } else {
        reviewResults[1]++;
      }
    });

    pieChart.labels = ['Good Reviews', 'Bad Reviews'];
    pieChart.colors = [
      { backgroundColor: ['rgba(67,205,119,0.8)', 'rgba(208,91,91,0.8)'] }
    ];
    pieChart.data = reviewResults;
  }

  getGenderSegregation(feedbackList: Feedback[], pieChart: PieChart) {
    const result = [0, 0];
    let count = 0;

    // Will be changed if data is found.
    pieChart.data = [0];
    pieChart.labels = ['No data'];

    feedbackList.forEach(feedback => {
      const sub = this.accountService
        .getUserFromUid(feedback.useruid)
        .subscribe(user => {
          count++;
          if (user.sex === 'male') {
            result[0]++;
          } else {
            result[1]++;
          }
          // Set the data and labels when all users have been checked.
          if (count === feedbackList.length) {
            pieChart.labels = ['Male', 'Female'];
            pieChart.colors = [
              {
                backgroundColor: ['rgba(51,153,255,0.8)', 'rgba(208,91,91,0.8)']
              }
            ];
            pieChart.data = result;
          }
          sub.unsubscribe();
        });
    });
  }

  getGeographicalSegmentation(feedbackList: Feedback[], pieChart: PieChart) {
    const userList = [];
    let cityCountArray: any = [];

    // Will be changed if data is found.
    pieChart.data = [0];
    pieChart.labels = ['No data'];

    // Gets all information about the user from their ids in the feedback given
    feedbackList.forEach(feedback => {
      const sub = this.accountService
        .getUserFromUid(feedback.useruid)
        .subscribe(user => {
          userList.push(user);
          this.userListSubject.next(userList);
          sub.unsubscribe();
        });
    });

    // Subscribe to the list of users
    const userSub = this.userListObs.subscribe(users => {
      // If all users are added to the list
      if (userList.length === feedbackList.length) {
        const cityCount: { [key: string]: number } = {};
        userList.forEach(user => {
          if (cityCount[user.city]) {
            cityCount[user.city] += 1;
          } else {
            cityCount[user.city] = 1;
          }
        });
        // Makes arrays from the dictionary to be sorted
        Object.keys(cityCount).forEach(key => {cityCountArray.push([key, cityCount[key]]); });
        // Sorts the arrays, so that the city with the most occurences comes first
        cityCountArray = cityCountArray.sort((a: any, b: any) => b[1] - a[1]);

        const data = [];
        const labels = [];
        // The pie chart only shows top 5 cities for readability
        let counter = 0;
        cityCountArray.forEach(city => {
          if (counter < 5) {
            labels.push(city[0]);
            data.push(city[1]);
          }
          counter++;
        });

        pieChart.colors = [
          {
            backgroundColor: [
              'rgba(65, 135, 151)',
              'rgba(52, 117, 177)',
              'rgba(173, 79, 115)',
              'rgba(173, 144, 88)',
              'rgba(159, 160, 178)'
            ]
          }
        ];

        pieChart.data = data;
        pieChart.labels = labels;
        userSub.unsubscribe();
      }
    });
  }

  getUserPreferences(feedbackList: Feedback[], radarChart: RadarChart) {
    const recommendationsArray = [];
    const recommender: { [key: string]: number } = {};

    // Will be changed if data is found.
    radarChart.data = [0];
    radarChart.labels = ['No data'];

    // Gets all information about the user from their ids in the feedback given
    feedbackList.forEach(feedback => {
      const sub = this.recommenderService
        .getRecommendedFromUserUid(feedback.useruid)
        .subscribe(userRec => {
          recommendationsArray.push(userRec);

          this.recommendationsSubject.next(recommendationsArray);
          sub.unsubscribe();
        });
    });

    this.recommendationsObs.subscribe(recommendations => {
      if (recommendations.length === feedbackList.length) {
        recommendations.forEach(rec => {
          Object.keys(rec).forEach(key => {
            if (recommender[key]) {
              recommender[key] += rec[key];
            } else {
              recommender[key] = rec[key];
            }
          });
        });
        const radarData = [];
        const radarLabels = [];
        Object.keys(recommender).forEach(item => {
          radarLabels.push(item);
          radarData.push(recommender[item]);
        });
        radarChart.labels = radarLabels;
        radarChart.data = radarData;
      }
    });
  }

  getCostAttendency(barChart: BarChart) {
    const labels = [];
    const priceLine = [];
    const dataTicketsSold = [];
    const dataTicketsAvailable = [];
    let count = 0;

    // Will be changed if data is found.
    barChart.data = [
      { data: [0], label: 'No data', type: 'line' }];
    barChart.labels = ['No data'];

    const sub = this.eventService.getAllEventsFromOrganizer(this.auth.selectedOrganizationUid)
      .subscribe(events => {
        for (const collection of events) {
          const event = collection.payload.doc.data() as Event;
          const ticketsSold = event.ticketsSold;
          const eventPrice = event.price;
          const ticketsAvailable = event.ticketsAvailable;

          dataTicketsAvailable.push(ticketsAvailable - ticketsSold);
          dataTicketsSold.push(ticketsSold);
          priceLine.push(eventPrice);

          labels.push(event.title);
          count ++;
          if (count === events.length) {
            barChart.labels = labels;
            barChart.data = [
              { data: priceLine, label: 'Ticket Price', type: 'line',
                backgroundColor: 'rgba(0, 0, 0,0)', pointBorderColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.8)' },
              { data: dataTicketsSold, label: 'Tickets Sold', stack: 'a', backgroundColor: 'rgba(208,91,91,0.8)' },
              { data: dataTicketsAvailable, label: 'Tickets Available', stack: 'a', backgroundColor: 'rgba(67,205,119,0.8)' }
            ];
          }
        }
        sub.unsubscribe();
      });
  }

  onEventSelect() {
    let feedbackList;
    const sub = this.feedbackService
      .getFeedbackFromEvent(this.selectedEvent, 100)
      .subscribe(items => {
        feedbackList = items;

        switch (this.selectedData) {
          // RATINGS
          case GraphData.Rating:
            this.getTotalRatings(feedbackList, this.currentChartObject);
            break;

          // GENDER
          case GraphData.Gender:
            this.getGenderSegregation(feedbackList, this.currentChartObject);
            break;

          // GEOGRAPHICAL
          case GraphData.Geo:
            this.getGeographicalSegmentation(
              feedbackList,
              this.currentChartObject
            );
            break;

          // USER PREFERENCE
          case GraphData.UserPreference:
            this.getUserPreferences(feedbackList, this.radarChartObject);
            break;
        }
        sub.unsubscribe();
      });
  }
}
