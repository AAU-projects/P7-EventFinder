import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartType, ChartOptions, ChartDataSets } from "chart.js";
import { Label, BaseChartDirective } from "ng2-charts";
import { AuthService } from "src/app/services/auth.service";
import { FeedbackService } from "src/app/services/feedback.service";
import { Feedback } from "src/app/models/feedback.model";
import { EventService } from "src/app/services/event.service";
import { AccountService } from "src/app/services/account.service";
import { Organization, Account } from "src/app/models/account.model";
import { Event } from "src/app/models/event.model";
import { GraphData } from "src/app/components/statistics/graph-data.enum";
import { User } from "src/app/models/account.model";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { RecommenderService } from 'src/app/services/recommender.service';

@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.scss"]
})
export class StatisticsComponent implements OnInit {
  @ViewChild("currentChart", { static: false })
  currentChart: BaseChartDirective;
  orgEventList = {};
  selectedEvent;
  selectedData;

  userListSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);
  public userListObs: Observable<User[]> = this.userListSubject.asObservable();

  recommendationsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  public recommendationsObs: Observable<any[]> = this.recommendationsSubject.asObservable();

  get graphData() {
    return GraphData;
  }

  public loading = true;

  // General pie chart formatting
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: "left",
      labels: { fontColor: "rgba(255, 255, 255)" }
    },
    elements: {
      arc: {
        borderColor: "rgba(50, 50, 89,1)",
        borderWidth: 7
      },
      line: {
        borderColor: "rgba(50, 50, 89,1)",
        borderWidth: 7
      }
    },
    hover: { mode: null }
  };

  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ["rgba(67,205,119,0.8)", "rgba(208,91,91,0.8)"]
    }
  ];

  // Currently selected chart
  public currentChartLabels;
  public currentChartData;
  public currentChartType;
  public currentChartLegend;
  public currentChartColors;

  // Overall rating pie data
  public overallRatingPieChartLabels: Label[] = ["Good Reviews", "Bad Reviews"];
  public overallRatingPieChartData;
  public overallRatingPieChartType: ChartType = "pie";
  public overallRatingPieChartLegend = true;
  public overallRatingPieChartColors = [
    {
      backgroundColor: ["rgba(67,205,119,0.8)", "rgba(208,91,91,0.8)"]
    }
  ];

  // Segregation pie data
  public segregationPieChartLabels: Label[] = ["Male", "Female"];
  public segregationPieChartData;
  public segregationPieCieChartColors = [
    {
      backgroundColor: ["rgba(67,205,119,0.8)", "rgba(208,91,91,0.8)"]
    }
  ];
  public segregationPieChartType: ChartType = "pie";
  public segregationPieChartLegend = true;
  public segregationPieChartColors = [
    {
      backgroundColor: ["rgba(67,205,119,0.8)", "rgba(208,91,91,0.8)"]
    }
  ];

  // Geo pie data
  public geoPieChartLabels: Label[] = [
    "9000 Aalborg C",
    "9200 Aalborg SV",
    "9220 Aalborg Ø",
    "8000 Aarhus C",
    "Other"
  ];
  public geoPieChartData;
  public geoPieChartColors = [
    {
      backgroundColor: [
        "rgba(65, 135, 151)",
        "rgba(52, 117, 177)",
        "rgba(173, 79, 115)",
        "rgba(173, 144, 88)",
        "rgba(159, 160, 178)"
      ]
    }
  ];
  public geoPieChartType: ChartType = "pie";
  public geoPieChartLegend = true;

  constructor(
    public auth: AuthService,
    private eventService: EventService,
    private feedbackService: FeedbackService,
    private accountService: AccountService,
    private recommenderService: RecommenderService
  ) {}

  ngOnInit() {
    const sub = this.eventService.getEvents(100).subscribe(result => {
      for (const collection of result) {
        const event = collection.payload.doc.data() as Event;

        if (event.organizationId === this.auth.selectedOrganizationUid) {
          this.orgEventList[event.uid] = event;
        }
      }
      this.selectedEvent = Object.keys(this.orgEventList)[0];
      this.selectedData = GraphData.UserPreference;
      this.loadData();
      sub.unsubscribe();
    });
  }

  onClickTest() {
    this.overallRatingPieChartData = [50, 50];
  }

  loadData() {
    // Initialize Selected Chart settings
    this.currentChartLabels = ["Good Reviews", "Bad Reviews"];
    this.currentChartType = "pie";
    this.initializeGraph();
    this.currentChartLegend = true;
    this.currentChartColors = [
      {
        backgroundColor: ["rgba(67,205,119,0.8)", "rgba(208,91,91,0.8)"]
      }
    ];

    this.segregationPieChartData = [47, 53];
    this.geoPieChartData = [292, 210, 144, 92, 15];
    setTimeout(() => (this.loading = false), 500);
  }

  initializeGraph() {
    let feedbackList;

    const sub = this.feedbackService
      .getFeedbackFromEvent(this.selectedEvent, 100)
      .subscribe(items => {
        feedbackList = items;
        this.currentChartData = this.getTotalRatings(feedbackList);
        sub.unsubscribe();
      });
  }

  getTotalRatings(feedbackList: Feedback[]) {
    const reviewResults = [0, 0];

    feedbackList.forEach(feedback => {
      if (feedback.rating > 2) {
        reviewResults[0]++;
      } else {
        reviewResults[1]++;
      }
    });

    return reviewResults;
  }

  getGenderSegregation(feedbackList: Feedback[]) {
    const result = [0, 0];

    feedbackList.forEach(feedback => {
      const sub = this.accountService
        .getUserFromUid(feedback.useruid)
        .subscribe(user => {
          if (user.sex === "male") {
            result[0]++;
          } else {
            result[1]++;
          }
          sub.unsubscribe();
        });
    });
    return result;
  }

  getGeographicalSegmentation(feedbackList: Feedback[]) {
    const userList = [];
    let cityCountArray: any = [];

    // Gets all information about the user from their ids in the feedback given.
    feedbackList.forEach(feedback => {
      const sub = this.accountService.getUserFromUid(feedback.useruid).subscribe(user => {
        userList.push(user);
        this.userListSubject.next(userList);
        sub.unsubscribe();
      });
    });

    // Subscribe to the list of users.
    this.userListObs.subscribe(users => {
      // If all users are added to the list.
      if (userList.length === feedbackList.length) {
        const cityCount: { [key: string]: number; } = {};
        userList.forEach(user => {
          if (cityCount[user.city]) {
            cityCount[user.city] += 1;
          } else {
            cityCount[user.city] = 1;
          }
        });
        // Makes arrays from the dictionary to be sorted.
        Object.keys(cityCount).forEach(key => {
          cityCountArray.push([key, cityCount[key]]);
        });
        // Sorts the arrays, so that the city with the most occurences comes first.
        cityCountArray = cityCountArray.sort((a: any, b: any) => b[1] - a[1]);

        let data = [];
        let labels = [];
        // The pie chart only shows top 5 cities for readability.
        let counter = 0;
        cityCountArray.forEach(city => {
          if (counter < 5) {
            labels.push(city[0]);
            data.push(city[1]);
          }
          counter ++;
        });
        this.currentChartData = data;
        this.currentChartLabels = labels;
      }
    });
  }

  getUserPreferences(feedbackList: Feedback[]) {
    const recommendationsArray = [];
    let recommender: { [key: string]: number; } = {};

    // Gets all information about the user from their ids in the feedback given.
    feedbackList.forEach(feedback => {
      const sub = this.recommenderService.getRecommendedFromUserUid(feedback.useruid).subscribe(userRec => {
        recommendationsArray.push(userRec);

        this.recommendationsSubject.next(recommendationsArray);
        sub.unsubscribe();
      });
    });

    this.recommendationsObs.subscribe(recommendations => {
      if (recommendations.length === feedbackList.length) {
        recommendations.forEach(rec => {
          console.log(rec);
          rec.forEach(recommendItem => {
            console.log(recommendItem);
          });
        });
      }
    });
  }

  getUserInfoFromFeedback(feedbackList: Feedback[]) {
    const userList: User[] = [];

    feedbackList.forEach(feedback => {
      const sub = this.accountService
        .getUserFromUid(feedback.useruid)
        .subscribe(user => {
          userList.push(user as User);
          sub.unsubscribe();
        });
    });

    return userList;
  }

  onEventSelect() {
    let sub;
    let feedbackList;
    switch (this.selectedData) {
      // RATINGS.
      case GraphData.Rating:
        // Chart settings
        this.currentChartLabels = ["Good Reviews", "Bad Reviews"];
        this.currentChartType = "pie";
        this.currentChartColors = [
          {
            backgroundColor: ["rgba(67,205,119,0.8)", "rgba(208,91,91,0.8)"]
          }
        ];

        sub = this.feedbackService
          .getFeedbackFromEvent(this.selectedEvent, 100)
          .subscribe(items => {
            feedbackList = items;
            this.currentChartData = this.getTotalRatings(feedbackList);
            setTimeout(() => this.currentChart.update(), 250);
            sub.unsubscribe();
          });
        break;

      // GENDER.
      case GraphData.Gender:
        // Chart settings
        this.currentChartLabels = ["Male", "Female"];
        this.currentChartType = "pie";
        this.currentChartColors = [
          {
            backgroundColor: ["rgba(67,205,119,0.8)", "rgba(208,91,91,0.8)"]
          }
        ];
        sub = this.feedbackService
          .getFeedbackFromEvent(this.selectedEvent, 100)
          .subscribe(items => {
            feedbackList = items;
            this.currentChartData = this.getGenderSegregation(feedbackList);
            setTimeout(() => this.currentChart.update(), 250);
            sub.unsubscribe();
          });
        break;

      // GEOGRAPHICAL.
      case GraphData.Geo:
        // Chart settings.
        this.currentChartColors = [
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

        sub = this.feedbackService
          .getFeedbackFromEvent(this.selectedEvent, 100)
          .subscribe(items => {
            feedbackList = items;
            this.currentChartType = 'pie';
            this.getGeographicalSegmentation(feedbackList);
            setTimeout(() => this.currentChart.update(), 250);
            sub.unsubscribe();
          });
        break;

      // USER PREFERENCE.
      case GraphData.UserPreference:
        this.loading = true;
          this.currentChartColors = [
            {
              backgroundColor: ["rgba(67,205,119,0.8)", "rgba(208,91,91,0.8)"]
            }
          ];
        sub = this.feedbackService
        .getFeedbackFromEvent(this.selectedEvent, 100)
        .subscribe(items => {
          feedbackList = items;
          this.currentChartType = 'radar';
          this.currentChartLabels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
          this.currentChartData = [
            [65, 59, 90, 81, 56, 55, 40],
            [28, 48, 40, 19, 96, 27, 100]
          ];
          //this.getUserPreferences(feedbackList);
          setTimeout(() => this.loading = false, 200);
          setTimeout(() => this.currentChart.update(), 250);
          sub.unsubscribe();
        });
        break;
    }
  }
}
