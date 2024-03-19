import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PokeApiService } from '../../services/poke-api.service';
import { Pokemon } from '../../typing/pokemon';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent implements OnInit, OnDestroy {
  public pokemonList: Pokemon[] = [];

  public searchTerm: string = '';
  public page = 1;
  public totalPokemons = 0;

  private originalPokemonList: Pokemon[] = [];
  private deletedePokemons: number[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private pokeService: PokeApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.deletedePokemons = this.pokeService.getDeletedPokemons();

    this.route.queryParams.subscribe((params) => {
      const offset = params['offset'] || 0;
      this.getPokemons();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private populatePokemonList() {
    this.pokemonList = this.originalPokemonList.filter(
      (pokemon) => !this.deletedePokemons.includes(pokemon.id)
    );
  }

  public getPokemons() {
    const limit = 10;
    const offset = (this.page * limit) - limit;
    this.pokeService
      .getPokemonListWithDetails(limit, offset)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.originalPokemonList = response.pokemons;
        this.totalPokemons = response.count;
        this.populatePokemonList();
      });
  }

  public deletePokemon(id: number): void {
    this.pokeService.deletePokemon(id);
    this.deletedePokemons = this.pokeService.getDeletedPokemons();
    this.populatePokemonList();
  }

  public onSearchChange(): void {
    this.pokemonList = this.originalPokemonList.filter(
      (pokemon) => !this.deletedePokemons.includes(pokemon.id)
    );
    this.pokemonList = this.pokemonList.filter((pokemon) =>
      pokemon.name.includes(this.searchTerm)
    );
  }

  public setSelectedPokemon(pokemon: Pokemon): void {
    this.pokeService.setSelectedPokemon(pokemon);
  }
}
