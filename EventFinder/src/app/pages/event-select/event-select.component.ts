import { Component, OnInit, HostListener } from "@angular/core";
import { SharedService } from "src/app/services/shared.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-event-select",
  templateUrl: "./event-select.component.html",
  styleUrls: ["./event-select.component.scss"]
})
export class EventSelectComponent implements OnInit {
  location = null;
  latitude = 0;
  longitude = 0;

  constructor(private shared: SharedService, private httpClient: HttpClient) {
    this.httpClient.get(this.apiAddress()).subscribe(result => {
      this.location = result["results"][0]["geometry"]["location"];
      console.log(result["results"][0]["geometry"]["location"]);
      this.latitude = this.location["lat"];
      this.longitude = this.location["lng"];
    });
  }

  ngOnInit() {}

  apiAddress() {
    return "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAxJpRUrMbG264kgpMZNhk916zvqP1K08U"
  }

  close() {
    this.shared.showEvent(false);
  }

  getEventTitleDescription() {
    return "Lorem ipsum dolor sit amet";
  }

  getEventDescription() {
    return (
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet." +
      "\n\n Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum." +
      "\n\n Lorem ipsum dolor sit amet Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
    );
  }

  getOrganizerDescription() {
    return (
      "OM MUSIKKENS HUS" +
      "\n På Aalborgs havnefront med frit udsyn over Limfjorden finder man Musikkens Hus; nordjydernes musikalske samlingspunkt og en arkitektonisk perle tegnet af det internationalt anerkendte arkitektfirma Coop Himmelb(l)au." +
      "\n\n Huset består af mere end 20.000 m2 fordelt på ni plan med bl.a. fire koncertsale, fem scener, en indbydende restaurant, en spændende foyer samt undervisnings- og administrationsfaciliteter. De faste beboere er Aalborg Symfoniorkester, Det Jyske Musikkonservatoriums Aalborgafdeling, Aalborg Universitets musikuddannelser og musikterapi, Musikkens Spisehus samt Musikkens Hus’ egen virksomhed." +
      "\n\nET BEVÆGENDE HUS" +
      "\nHusets mange arkitektoniske detaljer indbyder til udforskning og bevægelse. Når du bevæger dig rundt i huset, vil du opleve vægge, der skråner, trapper, der bugter og snor sig, runde vinduer i utallige størrelser og udskæringer, hyggelige lounges og altaner, smukke koncertsale med indkigspartier og meget mere. Når du har bevæget dig rundt i huset, er ønsket, at du skal bevæge dig ind i salene og lade musikken bevæge dig."
    );
  }

  getLocation() {
    return "Musikkens Pl. 1, 9000 Aalborg";
  }

  getDate() {
    return "September 7th, 2019 from 16:30 - 18:30";
  }

  getTitle() {
    return "A Conversation with President Barack Obama";
  }

  @HostListener("document:keydown", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === "Escape") {
      this.close();
    }
  }
}
