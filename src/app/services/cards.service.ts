import { Injectable } from '@angular/core';
import { Card, Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private cards: Card[] = [
    // Mode Classique
    { id: '1', mode: 'classique', type: 'vérité', description: 'Joueur 1 doit avouer un secret gênant', genreJoueur1: 'Tous', repetable: false },
    { id: '2', mode: 'classique', type: 'vérité', description: 'Joueur 1 doit dire ce qui lui plaît le plus chez Joueur 2', genreJoueur1: 'Tous', genreJoueur2: 'Tous', repetable: false },
    { id: '3', mode: 'classique', type: 'action', description: 'Joueur 1 doit chanter une chanson', genreJoueur1: 'Tous', repetable: false, timer: 30 },
    { id: '4', mode: 'classique', type: 'action', description: 'Joueur 1 doit faire 20 pompes', genreJoueur1: 'Homme', repetable: false },
    { id: '5', mode: 'classique', type: 'action', description: 'Joueur 1 doit faire une danse de 15 secondes', genreJoueur1: 'Tous', repetable: false, timer: 15, photoObligatoire: true },
    { id: '6', mode: 'classique', type: 'vérité', description: 'Joueur 1 doit dire son plus gros mensonge', genreJoueur1: 'Tous', repetable: false },
    { id: '7', mode: 'classique', type: 'action', description: 'Joueur 1 doit imiter un animal pendant 20 secondes', genreJoueur1: 'Tous', repetable: false, timer: 20, photoObligatoire: true },
    { id: '8', mode: 'classique', type: 'vérité', description: 'Joueur 1 doit révéler sa pire habitude', genreJoueur1: 'Tous', repetable: false },
    
    // Mode En soirée
    { id: '9', mode: 'soiree', type: 'action', description: 'Joueur 1 doit boire un verre cul sec', genreJoueur1: 'Tous', repetable: false, timer: 10 },
    { id: '10', mode: 'soiree', type: 'vérité', description: 'Joueur 1 doit raconter son moment le plus embarrassant', genreJoueur1: 'Tous', repetable: false },
    { id: '11', mode: 'soiree', type: 'action', description: 'Joueur 1 doit danser avec Joueur 2 pendant 30 secondes', genreJoueur1: 'Femme', genreJoueur2: 'Homme', repetable: false, timer: 30, photoObligatoire: true },
    { id: '12', mode: 'soiree', type: 'vérité', description: 'Joueur 1 doit dire qui est la personne la plus attirante ici', genreJoueur1: 'Tous', repetable: false },
    { id: '13', mode: 'soiree', type: 'action', description: 'Joueur 1 doit faire un limbo', genreJoueur1: 'Tous', repetable: false, photoObligatoire: true },

      // Mode hot
      {id : '12', mode: 'hot', type: 'vérité', description: 'Joueur 1 doit demander à joueur 2 s\'il préfère perdre son pénis ou ses bras', genreJoueur1: 'Tous', genreJoueur2:'Homme', repetable: false, timer: 30 },
  ];

  getCardsByMode(mode: string): Card[] {
    return this.cards.filter(card => card.mode === mode);
  }

  getCardById(id: string): Card | undefined {
    return this.cards.find(card => card.id === id);
  }

  drawRandomCard(mode: string, type: 'action' | 'vérité', currentPlayer: Player, excludedIds: Set<string>): Card | null {
    const availableCards = this.cards.filter(card => {
      // Vérifie le mode
      if (card.mode !== mode) return false;
      
      // Vérifie le type
      if (card.type !== type) return false;
      
      // Vérifie le genre du joueur
      if (card.genreJoueur1 !== 'Tous' && card.genreJoueur1 !== currentPlayer.genre) return false;
      
      // Vérifie si la carte a déjà été tirée (sauf si repetable)
      if (!card.repetable && excludedIds.has(card.id)) return false;
      
      return true;
    });

    if (availableCards.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    return availableCards[randomIndex];
  }

  replaceVariables(card: Card, currentPlayer: Player, otherPlayers: Player[]): string {
    let description = card.description;
    
    // Remplace Joueur 1 par le pseudo du joueur actuel
    description = description.replace(/Joueur 1/g, currentPlayer.pseudo);
    
    // Remplace Joueur 2 si nécessaire
    if (description.includes('Joueur 2')) {
      const compatiblePlayers = otherPlayers.filter(p => 
        !card.genreJoueur2 || card.genreJoueur2 === 'Tous' || p.genre === card.genreJoueur2
      );
      
      if (compatiblePlayers.length > 0) {
        const randomPlayer = compatiblePlayers[Math.floor(Math.random() * compatiblePlayers.length)];
        description = description.replace(/Joueur 2/g, randomPlayer.pseudo);
      }
    }
    
    return description;
  }
}

