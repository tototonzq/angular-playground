import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, concatMap, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  clickApi() {
    this.http
      .get<{ key: number }>('http://localhost:10002/get-auth')
      .pipe(
        switchMap((responseAuth) => {
          switch (responseAuth.key) {
            case 1:
              return this.http
                .get<{ id: number }>('http://localhost:10002/get-image')
                .pipe(
                  concatMap((responseGetImage: { id: number }) =>
                    this.http
                      .get(`http://localhost:10002/${responseGetImage.id}`)
                      .pipe(
                        catchError((error) => {
                          if (error.status === 500) {
                            console.error(
                              'Internal Server Error occurred while fetching image data'
                            );
                          }
                          return of(null);
                        })
                      )
                  ),
                  switchMap(() =>
                    this.http.get('http://localhost:10002/get-permission').pipe(
                      catchError((error) => {
                        if (error.status === 500) {
                          console.error(
                            'Internal Server Error occurred while fetching permission data'
                          );
                        }
                        return of(null);
                      })
                    )
                  )
                );
            case 2:
              return this.http
                .get('http://localhost:10002/get-other-data')
                .pipe(
                  catchError((error) => {
                    if (error.status === 500) {
                      console.error(
                        'Internal Server Error occurred while fetching other data'
                      );
                    }
                    return of(null);
                  })
                );
            default:
              return of([]);
          }
        })
      )
      .subscribe({
        next: (response) => console.log('Final response:', response),
        error: (error) => console.error('Error occurred:', error),
        complete: () => console.log('API calls completed'),
      });
  }
}
