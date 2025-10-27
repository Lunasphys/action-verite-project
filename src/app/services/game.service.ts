import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState, Player, GameMode, Card } from '../models/player.model';
import { StorageService } from './storage.service';
import { CardsService } from './cards.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameState = new BehaviorSubject<GameState>({
    players: [],
    currentPlayerIndex: 0,
    mode: null,
    consecutiveTruths: 0,
    drawnCards: new Set()
  });

  gameState$ = this.gameState.asObservable();

  constructor(
    private storageService: StorageService,
    private cardsService: CardsService
  ) { }

  async initGame(players: Player[], mode: GameMode): Promise<void> {
    const newState: GameState = {
      players,
      currentPlayerIndex: 0,
      mode,
      consecutiveTruths: 0,
      drawnCards: new Set()
    };
    
    await this.storageService.savePlayers(players);
    this.gameState.next(newState);
  }

  getCurrentPlayer(): Player | null {
    const state = this.gameState.value;
    if (state.players.length === 0) return null;
    return state.players[state.currentPlayerIndex];
  }

  drawCard(type: 'action' | 'vérité'): Card | null {
    const state = this.gameState.value;
    const currentPlayer = this.getCurrentPlayer();
    
    if (!currentPlayer || !state.mode) return null;

    const card = this.cardsService.drawRandomCard(
      state.mode.id,
      type,
      currentPlayer,
      state.drawnCards
    );

    if (card) {
      // Marque la carte comme tirée si non répétable
      if (!card.repetable) {
        state.drawnCards.add(card.id);
      }
      
      // Met à jour le compteur de vérités consécutives
      if (type === 'vérité') {
        state.consecutiveTruths++;
      } else {
        state.consecutiveTruths = 0;
      }
      
      this.gameState.next({ ...state });
    }

    return card;
  }

  nextPlayer(): void {
    const state = this.gameState.value;
    const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
    
    this.gameState.next({
      ...state,
      currentPlayerIndex: nextIndex,
      consecutiveTruths: 0,
      drawnCards: new Set() // Réinitialise pour le nouveau joueur
    });
  }

  canChooseTruth(): boolean {
    const state = this.gameState.value;
    return state.consecutiveTruths < 3;
  }

  getConsecutiveTruths(): number {
    return this.gameState.value.consecutiveTruths;
  }

  resetGame(): void {
    this.gameState.next({
      players: [],
      currentPlayerIndex: 0,
      mode: null,
      consecutiveTruths: 0,
      drawnCards: new Set()
    });
  }
}

