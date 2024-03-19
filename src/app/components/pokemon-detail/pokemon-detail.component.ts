import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../../typing/pokemon';
import { PokeApiService } from '../../services/poke-api.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss'
})
export class PokemonDetailComponent implements OnInit {

  pokemonId: null | string = null;
  pokemonData: Pokemon | undefined;
  constructor(private route: ActivatedRoute, private pokeService: PokeApiService) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.pokemonId = params.get('id')
      console.log(this.pokemonId);
    });

    console.log(this.pokeService.getSelectedPokemon())
  }

}
