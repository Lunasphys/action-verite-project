import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Card, Player } from '../../models/player.model';
import { GameService } from '../../services/game.service';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage implements OnInit {
  currentPlayer: Player | null = null;
  currentCard: Card | null = null;
  isCardVisible = false;
  hasTimer = false;
  timerValue = 0;
  timerInterval: any;

  constructor(
    private gameService: GameService,
    private cardsService: CardsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGame();
  }

  loadGame() {
    this.currentPlayer = this.gameService.getCurrentPlayer();
    if (!this.currentPlayer) {
      this.router.navigate(['/home']);
    }
  }

  async chooseType(type: 'action' | 'vérité') {
    // Vérifie si on peut choisir vérité
    if (type === 'vérité' && !this.gameService.canChooseTruth()) {
      return;
    }

    this.isCardVisible = false;
    const card = this.gameService.drawCard(type);
    
    if (!card) {
      alert('Aucune carte disponible');
      return;
    }

    this.currentCard = card;
    this.isCardVisible = true;

    // Si la carte a un timer, on le démarre
    if (card.timer) {
      this.startTimer(card.timer);
    }
  }

  startTimer(duration: number) {
    this.hasTimer = true;
    this.timerValue = duration;

    this.timerInterval = setInterval(() => {
      this.timerValue--;
      
      if (this.timerValue <= 0) {
        clearInterval(this.timerInterval);
        this.hasTimer = false;
        this.vibrate();
        alert('Temps écoulé !');
      }
    }, 1000);
  }

  async vibrate() {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      console.log('Haptics non disponibles');
    }
  }

  nextPlayer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.gameService.nextPlayer();
    this.isCardVisible = false;
    this.currentCard = null;
    this.loadGame();
  }

  getConsecutiveTruths(): number {
    return this.gameService.getConsecutiveTruths();
  }

  canChooseTruth(): boolean {
    return this.gameService.canChooseTruth();
  }

  getFormattedDescription(): string {
    if (!this.currentCard || !this.currentPlayer) return '';
    
    // Cette fonction devrait être implémentée dans le service
    return this.currentCard.description.replace(/Joueur 1/g, this.currentPlayer.pseudo);
  }
}

