import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/service/favorites.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
})
export class FavoritosComponent implements OnInit {
  favoritos: string[] = [];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.getFavorites();
  }

  getFavorites(): void {
    this.favoritos = this.favoritesService.getFavorites();
  }
}
