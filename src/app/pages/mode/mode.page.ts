import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameMode } from '../../models/player.model';
import { GameService } from '../../services/game.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-mode',
  templateUrl: 'mode.page.html',
  styleUrls: ['mode.page.scss'],
})
export class ModePage implements OnInit {
  gameModes: GameMode[] = [
    { id: 'classique', name: 'Mode Classique', description: 'Le mode traditionnel pour tous les publics' },
    { id: 'soiree', name: 'En soirée', description: 'Parfait pour animer vos soirées' }
  ];

  constructor(
    private gameService: GameService,
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Vérifie qu'il y a des joueurs
    const players = await this.storageService.getPlayers();
    if (players.length < 2) {
      this.router.navigate(['/home']);
    }
  }

  async selectMode(mode: GameMode) {
    const players = await this.storageService.getPlayers();
    await this.gameService.initGame(players, mode);
    this.router.navigate(['/game']);
  }
}

