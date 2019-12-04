import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { Router } from '@angular/router';
=======
>>>>>>> develop

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
<<<<<<< HEAD
  searchString: string;
  constructor(private router: Router) {
=======
  constructor() {
>>>>>>> develop
  }

  ngOnInit() {
  }

  search() {
    this.router.navigate([`/events/search/${this.searchString.replace(' ', '_')}`]);
  }
}
