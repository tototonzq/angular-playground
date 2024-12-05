import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { log } from 'console';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
})
export class AppComponent implements OnInit {
  public _http = inject(HttpClient);

  constructor() {
    // this._http.get('/api/test').subscribe((data) => log(data));
  }

  ngOnInit(): void {}
}
