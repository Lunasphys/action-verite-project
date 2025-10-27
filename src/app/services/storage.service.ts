import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  async setPlayer(player: Player): Promise<void> {
    localStorage.setItem('currentPlayer', JSON.stringify(player));
  }

  async getPlayer(): Promise<Player | null> {
    const playerData = localStorage.getItem('currentPlayer');
    return playerData ? JSON.parse(playerData) : null;
  }

  async savePlayers(players: Player[]): Promise<void> {
    localStorage.setItem('players', JSON.stringify(players));
  }

  async getPlayers(): Promise<Player[]> {
    const playersData = localStorage.getItem('players');
    return playersData ? JSON.parse(playersData) : [];
  }
}
