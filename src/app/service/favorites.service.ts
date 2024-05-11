import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private storageKey = 'favorites';

  addFavorite(username: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(username)) {
      favorites.push(username);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
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
    const storedFavorites = localStorage.getItem(this.storageKey);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  isFavorite(username: string): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(username);
  }
}
