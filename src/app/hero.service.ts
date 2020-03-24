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
      catchError(this.handleError<Hero[]>('get_heroes', []))
    );
  }

  get_hero(id: number): Observable<Hero> {
    const url = `${this.heroes_Url}/${id}`
    return this.http.get<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`fetched hero id = ${id}`)),
      catchError(this.handleError<Hero>(`get_hero id = ${id}`))
    );
  }

  update_hero(hero: Hero): Observable<Hero> {
    const url = `${this.heroes_Url}/${hero.id}`
    return this.http.put<Hero>(url, {'name': hero.name}, this.httpOptions).pipe(
      tap(_ => this.log(`Updated hero id = ${hero.id}`)),
      catchError(this.handleError<Hero>('update_hero'))
    );
  }

  add_hero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroes_Url, hero, this.httpOptions).pipe(
      tap(_ => this.log(`Added hero ${hero.name}`)),
      catchError(this.handleError<Hero>('add_hero'))
    );
  }

  delete_hero(hero: Hero): Observable<Hero> {
    const url = `${this.heroes_Url}/${hero.id}`
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Deleted hero id = ${hero.id}`)),
      catchError(this.handleError<Hero>('delete_hero'))
    );
  }

  search_heroes(term: string): Observable<Hero[]> {
    if (!term.trim()){
      of([]);
    }
    return this.http.get<Hero[]>(`${this.heroes_Url}?name=${term}`, this.httpOptions).pipe(
      tap(x => x.length ?
        this.log(`found heroes mathing "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('search_heroes', []))
    );
  }
}
