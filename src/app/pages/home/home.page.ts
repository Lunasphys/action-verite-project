import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Player } from '../../models/player.model';
import { StorageService } from '../../services/storage.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentPseudo: string = '';
  currentGenre: 'Homme' | 'Femme' = 'Homme';
  players: Player[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    // Charge les joueurs sauvegardés
    this.players = await this.storageService.getPlayers();
    
    // Charge le joueur actuel
    const savedPlayer = await this.storageService.getPlayer();
    if (savedPlayer) {
      this.currentPseudo = savedPlayer.pseudo;
      this.currentGenre = savedPlayer.genre;
    }
  }

  addPlayer() {
    if (!this.currentPseudo.trim()) {
      this.showAlert('Erreur', 'Veuillez entrer un pseudo');
      return;
    }

    const newPlayer: Player = {
      id: uuidv4(),
      pseudo: this.currentPseudo.trim(),
      genre: this.currentGenre
    };

    this.players.push(newPlayer);
    this.currentPseudo = '';
    this.currentGenre = 'Homme';
  }

  removePlayer(player: Player) {
    this.players = this.players.filter(p => p.id !== player.id);
  }

  async startGame() {
    if (this.players.length === 0) {
      await this.showAlert('Erreur', 'Veuillez ajouter au moins un joueur');
      return;
    }

    if (this.players.length < 2) {
      await this.showAlert('Erreur', 'Veuillez ajouter au moins 2 joueurs');
      return;
    }

    // Sauvegarde le joueur actuel
    if (this.currentPseudo.trim()) {
      await this.storageService.setPlayer({
        id: 'current',
        pseudo: this.currentPseudo.trim(),
        genre: this.currentGenre
      });
    }

    // Passe à la page de sélection du mode
    this.router.navigate(['/mode']);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

