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
        //checa se o perfil está favoritado
        if (this.userProfile) {
          const username = this.userProfile.login;
          this.isProfileFavorited = this.favoritesService.isFavorite(username);
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

  //funcionalidade de favoritos
  addFavorite(): void {
    if (this.userProfile) {
      this.favoritesService.addFavorite(this.userProfile.login);
      this.isProfileFavorited = true;
    }
  }

  checkProfileFavorite(): void {
    if (this.userProfile) {
      const username = this.userProfile.login;
      this.isProfileFavorited = this.favoritesService.isFavorite(username);
    }
  }
}
