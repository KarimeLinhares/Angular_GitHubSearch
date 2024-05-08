import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/service/favorites.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  favoriteProfiles: string[];
  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.favoriteProfiles = this.favoritesService.getFavorites();
  }
}
