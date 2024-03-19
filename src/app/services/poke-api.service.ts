import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Pokemon, PokemonDetailResponse, PokemonListResponse } from '../typing/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  private url = 'https://pokeapi.co/api/v2/pokemon/';
  private selectedPokemon: Pokemon | undefined;

  constructor(private http: HttpClient) { }

  public getPokemon(id: number | string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.url}${id}`);
  }

  private getPokemonList(limit: number, offset: number): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.url}?limit=${limit}&offset=${offset}`); 
  }

  public getPokemonListWithDetails(limit: number, offset: number): Observable<PokemonDetailResponse> {
    return this.getPokemonList(limit, offset).pipe(
      switchMap((response: PokemonListResponse) => {
        const observables: Observable<Pokemon>[] = response.results.map(pokemon => this.getPokemon(pokemon.name));
        return forkJoin(observables).pipe(
          map(pokemons => {
            return {
              count: response.count,
              next: response.next,
              previous: response.previous,
              pokemons
            };
          })
        );
      })
    );
  }
  public getDeletedPokemons(): number[] {
    const deletedPokemons: number[] = [];
    const storage = localStorage.getItem('softDeletedPokemons');
    if (storage) {
      const pokemons: number[] = JSON.parse(storage);
      deletedPokemons.push(...pokemons);
    }
    return deletedPokemons;
  }

  public deletePokemon(id: number): void {
    const deletedPokemons = this.getDeletedPokemons();
    deletedPokemons.push(id);
    localStorage.setItem('softDeletedPokemons', JSON.stringify(deletedPokemons));
  }

  public setSelectedPokemon(pokemon: Pokemon): void {
    this.selectedPokemon = pokemon;
  }

  public getSelectedPokemon(): Pokemon | undefined {
    return this.selectedPokemon;
  }
}
