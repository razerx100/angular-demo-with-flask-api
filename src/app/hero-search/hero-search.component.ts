import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private search_terms = new Subject<string>();
  constructor(private hero_service: HeroService) { }

  search(term: string): void {
    this.search_terms.next(term)
  }

  ngOnInit(): void {
    this.heroes$ = this.search_terms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.hero_service.search_heroes(term)),
    )
  }

}
