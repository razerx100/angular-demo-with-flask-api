import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { Heroes } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  private heroes_Url = 'http://localhost:5000/api/heroes';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('razerx100:3540')
    })
  };
  constructor(
    private message_service: MessageService,
    private http: HttpClient
    ) { }

  private log(message: string): void {
    this.message_service.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  get_heroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroes_Url, this.httpOptions)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  get_hero(id: number): Observable<Hero> {
    const url = `${this.heroes_Url}/${id}`
    this.message_service.add(`HeroService: fetched hero id = ${id}`);
    return this.http.get<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
  }
}
