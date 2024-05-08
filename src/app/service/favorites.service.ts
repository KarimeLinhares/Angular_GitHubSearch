import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private storageKey = 'favorites';

  constructor() {}
  addFavorite(username: string): void {
    const favorites = this.getFavorites();
    favorites.push(username);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  removeFavorite(username: string): void {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(username);
    if (index !== -1) {
      favorites.splice(index, 1);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }

  getFavorites(): string[] {
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  isFavorite(username: string): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(username);
  }
}
