import { Observable, of, fromEvent } from 'rxjs';
import { GithubService } from './../../service/github.service';
import { FavoritesService } from 'src/app/service/favorites.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  userProfile$: Observable<any>;
  userRepos$: Observable<any[]>;
  techStack$: Observable<any>;
  topTechs$: Observable<any>;
  searchResult$: Observable<any>;
  userProfileData: any;
  userProfileRepo: any;
  isProfileFavorited: boolean = false;
  error: any;
  loading: boolean;

  username: string;
  userProfileImageUrl: string;

  constructor(
    private githubService: GithubService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.username = 'karimelinhares';
    this.fetchUserProfile();
    this.fetchUserTechStack();
    this.fetchUserRepos();
    this.checkProfileFavorite();
  }

  //user
  fetchUserProfile(): void {
    this.userProfile$ = this.githubService.getUserProfile(this.username);
    this.userProfile$.subscribe(
      (response) => {
        this.loading = false;
        this.userProfileData = response;
        console.log(response);
        this.userProfileImageUrl = response.avatar_url;
        this.fetchUserTechStack();
        this.fetchUserRepos();
        if (this.userProfileData) {
          const username = this.userProfileData.login;
          this.isProfileFavorited = this.favoritesService.isFavorite(username);
        }
      },
      (error) => {
        this.loading = false;
        this.error = error;
      }
    );
  }

  //repos
  fetchUserRepos(): void {
    this.userRepos$ = this.githubService.getUserRepos(this.username);
    this.userRepos$.subscribe(
      (response) => {
        this.loading = false;
        this.userProfileRepo = response;
        console.log(response);
      },
      (error) => {
        this.loading = false;
        this.error = error;
      }
    );
  }

  //stacks usadas
  fetchUserTechStack(): void {
    this.githubService.getUserRepos(this.username).subscribe((repos) => {
      const techStackMap = new Map<string, number>();
      repos.forEach((repo) => {
        const languages = repo.language ? repo.language.split(',') : [];
        languages.forEach((language) => {
          const lowerCaseLanguage = language.toLowerCase().trim();
          if (techStackMap.has(lowerCaseLanguage)) {
            techStackMap.set(
              lowerCaseLanguage,
              techStackMap.get(lowerCaseLanguage) + 1
            );
          } else {
            techStackMap.set(lowerCaseLanguage, 1);
          }
        });
      });

      const sortedTechStack = Array.from(techStackMap.entries()).sort(
        (a, b) => b[1] - a[1]
      );

      this.topTechs$ = of(sortedTechStack.slice(0, 5));
    });
  }

  //funcionalidade de favoritos
  addFavorite(): void {
    if (this.userProfileData) {
      this.favoritesService.addFavorite(this.userProfileData.login);
      this.isProfileFavorited = true;
    }
  }

  checkProfileFavorite(): void {
    if (this.userProfileData) {
      const username = this.userProfileData.login;
      this.isProfileFavorited = this.favoritesService.isFavorite(username);
    }
  }
}
