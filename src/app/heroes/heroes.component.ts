import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  constructor(private hero_service: HeroService, private message_service: MessageService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.hero_service.get_heroes().subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    if(!name) {return;}
    name = name.trim()
    this.hero_service.add_hero({name} as Hero)
    .subscribe(() => this.getHeroes());
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.hero_service.delete_hero(hero).subscribe();
  }
}
