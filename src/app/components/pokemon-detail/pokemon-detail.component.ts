import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon, Stat, StatsData } from '../../typing/pokemon';
import { PokeApiService } from '../../services/poke-api.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss',
})
export class PokemonDetailComponent implements OnInit {
  pokemonId: null | string = null;
  pokemonData: Pokemon | undefined;
  constructor(
    private route: ActivatedRoute,
    private pokeService: PokeApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.pokemonId = params.get('id');
      this.getPokemon(this.pokemonId);
    });
  }

  private getPokemon(pokemonId: string | null) {
    const selectedPokemon = this.pokeService.getSelectedPokemon();

    if (selectedPokemon) {
      this.pokemonData = selectedPokemon;
    } else {
      if (pokemonId) {
        this.pokeService.getPokemon(pokemonId).subscribe((pokemon) => {
          this.pokemonData = pokemon;
        });
      } else {
        // handle error
      }
    }
  }

  public get generateStatsData(): StatsData[] {
    if (this.pokemonData) {
      const statsData: StatsData[] = this.pokemonData.stats.map(
        (stat: Stat) => {
          return {
            label: stat.stat.name,
            value: stat.base_stat,
          };
        }
      );
      statsData.shift();
      return statsData;
      
    }
    return [];
  }
}
