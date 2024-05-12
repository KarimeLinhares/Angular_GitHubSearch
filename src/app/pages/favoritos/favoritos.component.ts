import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/service/favorites.service';
import { GithubApiService } from 'src/app/service/github-api.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private githubApiService: GithubApiService
  ) {}

  ngOnInit(): void {
    this.getFavorites();
  }

  getFavorites(): void {
    const usernames = this.favoritesService.getFavorites();
    this.favoritos = [];

    usernames.forEach((username) => {
      this.githubApiService.getUserProfile(username).subscribe(
        (userProfile: any) => {
          this.githubApiService.getUserRepos(username).subscribe(
            (userRepos: any[]) => {
              const topTechs = this.getTopTechs(userRepos, 3);
              const user = {
                username: username,
                avatar_url: userProfile.avatar_url,
                name: userProfile.name,
                location: userProfile.location,
                topTechs: topTechs,
              };
              this.favoritos.push(user);
            },
            (error) => {
              console.error('Error fetching user repositories:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching user profile:', error);
        }
      );
    });
  }

  removeFavorite(username: string): void {
    this.favoritesService.removeFavorite(username);
    this.getFavorites();
  }

  //stacks mais usadas
  getTopTechs(userRepos: any[], limit: number): string[] {
    const techStack: { [key: string]: number } = {};

    userRepos.forEach((repo) => {
      if (repo.language) {
        techStack[repo.language] = (techStack[repo.language] || 0) + 1;
      }
      if (repo.topics) {
        repo.topics.forEach((topic) => {
          techStack[topic] = (techStack[topic] || 0) + 1;
        });
      }
    });

    const sortedTechStack = Object.entries(techStack).sort(
      (a, b) => b[1] - a[1]
    );
    return sortedTechStack.slice(0, limit).map((entry) => entry[0]);
  }
}
