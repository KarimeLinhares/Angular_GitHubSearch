import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubApiService } from 'src/app/service/github-api.service';
import { FavoritesService } from 'src/app/service/favorites.service';

@Component({
  selector: 'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrls: ['./user-profile-details.component.scss'],
})
export class UserProfileDetailsComponent implements OnInit {
  userProfile: any;
  userRepo: any;
  username: string;
  topTechs: any;
  isProfileFavorited: boolean = false;
  error: any;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private githubApiService: GithubApiService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params['username'];
      this.fetchUserProfile(this.username);
    });
    this.fetchUserTechStack();
    this.fetchUserRepos(this.username);
    this.checkProfileFavorite();
  }

  //user
  fetchUserProfile(username: string): void {
    this.githubApiService.getUserProfile(username).subscribe(
      (userProfile: any) => {
        this.userProfile = userProfile;
        console.log(userProfile);

        if (this.userProfile) {
          const userLogin = this.userProfile.login;
          this.isProfileFavorited = this.favoritesService.isFavorite(userLogin);
        }
      },
      (error: any) => {
        console.error('Erro ao buscar perfil do usuário:', error);
      }
    );
  }

  //repos
  fetchUserRepos(username: string): void {
    this.githubApiService.getUserRepos(username).subscribe(
      (userRepo: any) => {
        this.userRepo = userRepo;
        console.log(userRepo);
      },
      (error: any) => {
        console.error('Erro ao buscar perfil do usuário:', error);
      }
    );
  }

  //stacks mais usadas
  fetchUserTechStack(): void {
    this.githubApiService
      .getUserRepos(this.username)
      .subscribe((repos: any[]) => {
        const techStack = this.githubApiService.getUserTechStack(repos);
        const sortedTechStack = Object.entries(techStack).sort(
          (a, b) => b[1] - a[1]
        );
        this.topTechs = sortedTechStack.slice(0, 5);
      });
  }

  // Funcionalidade para adicionar ou remover o perfil dos favoritos
  addOrRemoveFavorite(username: string): void {
    if (this.userProfile) {
      if (this.isProfileFavorited) {
        // Se já estiver favoritado, remova-o dos favoritos
        this.favoritesService.removeFavorite(username);
      } else {
        // Caso contrário, adicione-o aos favoritos
        this.favoritesService.addFavorite(username);
      }
      // Atualize o estado isProfileFavorited para refletir a mudança
      this.isProfileFavorited = !this.isProfileFavorited;
    }
  }

  // Verifique se o perfil está favoritado
  checkProfileFavorite(): void {
    if (this.userProfile) {
      const username = this.userProfile.login;
      this.isProfileFavorited = this.favoritesService.isFavorite(username);
    }
  }
}
