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
  ) {
    // Essaie de charger l'état sauvegardé au démarrage
    this.loadGameState();
  }

  async initGame(players: Player[], mode: GameMode): Promise<void> {
    const newState: GameState = {
      players,
      currentPlayerIndex: 0,
      mode,
      consecutiveTruths: 0,
      drawnCards: new Set()
    };
    
    await this.storageService.savePlayers(players);
    await this.saveGameState(newState);
    this.gameState.next(newState);
  }

  private async loadGameState(): Promise<void> {
    try {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        parsed.drawnCards = new Set(parsed.drawnCards || []);
        this.gameState.next(parsed);
      }
    } catch (e) {
      console.log('Erreur lors du chargement de l\'état', e);
    }
  }

  private async saveGameState(state: GameState): Promise<void> {
    try {
      // Convertit Set en Array pour le JSON
      const stateToSave = {
        ...state,
        drawnCards: Array.from(state.drawnCards)
      };
      localStorage.setItem('gameState', JSON.stringify(stateToSave));
    } catch (e) {
      console.log('Erreur lors de la sauvegarde de l\'état', e);
    }
  }

  getCurrentPlayer(): Player | null {
    const state = this.gameState.value;
    if (state.players.length === 0) return null;
    return state.players[state.currentPlayerIndex];
  }

  async drawCard(type: 'action' | 'vérité'): Promise<Card | null> {
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
      await this.saveGameState({ ...state });
    }

    return card;
  }

  async nextPlayer(): Promise<void> {
    const state = this.gameState.value;
    const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
    
    const newState: GameState = {
      players: state.players,
      currentPlayerIndex: nextIndex,
      mode: state.mode,
      consecutiveTruths: 0,
      drawnCards: new Set<string>() // Réinitialise pour le nouveau joueur
    };
    
    this.gameState.next(newState);
    await this.saveGameState(newState);
  }

  canChooseTruth(): boolean {
    const state = this.gameState.value;
    return state.consecutiveTruths < 3;
  }

  getConsecutiveTruths(): number {
    return this.gameState.value.consecutiveTruths;
  }

  getAllPlayers(): Player[] {
    return this.gameState.value.players;
  }

  getOtherPlayers(): Player[] {
    const state = this.gameState.value;
    if (!state.players || state.players.length === 0) return [];
    
    const currentPlayer = state.players[state.currentPlayerIndex];
    // Retourne tous les joueurs sauf le joueur actuel
    return state.players.filter(p => p.id !== currentPlayer.id);
  }

  async resetGame(): Promise<void> {
    const newState: GameState = {
      players: [],
      currentPlayerIndex: 0,
      mode: null,
      consecutiveTruths: 0,
      drawnCards: new Set<string>()
    };
    this.gameState.next(newState);
    await this.saveGameState(newState);
  }
}

