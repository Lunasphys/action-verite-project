export interface Player {
  id: string;
  pseudo: string;
  genre: 'Homme' | 'Femme';
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
}

export interface Card {
  id: string;
  mode: string;
  type: 'action' | 'vérité';
  description: string;
  genreJoueur1: 'Homme' | 'Femme' | 'Tous';
  genreJoueur2?: 'Homme' | 'Femme' | 'Tous';
  timer?: number;
  repetable: boolean;
  photoObligatoire?: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  mode: GameMode | null;
  consecutiveTruths: number;
  drawnCards: Set<string>; // IDs des cartes déjà tirées pour le joueur actuel
}
