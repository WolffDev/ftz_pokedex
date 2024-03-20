import { Component, Input, OnInit } from '@angular/core';
import { StatsData } from '../../typing/pokemon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-stats',
  templateUrl: './pokemon-stats.component.html',
  styleUrl: './pokemon-stats.component.scss',
  standalone: true,
imports: [CommonModule]
})
export class PokemonStatsComponent {

  @Input() statsData!: StatsData[];


  constructor() {}

}
