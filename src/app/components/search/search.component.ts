import { Observable, of } from 'rxjs';
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
  techStack$: Observable<any>;
  topTechs$: Observable<any>;
  userProfileData: any;
  error: any;
  loading: boolean;
  isFavorite: boolean;
  username: string;
  userProfileImageUrl: string;
  searchQuery: string;
  searchResults$: Observable<any[]>;

  constructor(
    private githubService: GithubService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.username = 'karimelinhares';
    this.fetchUserProfile();
    this.fetchUserTechStack();
    this.searchQuery = '';
  }

  fetchUserProfile(): void {
    this.userProfile$ = this.githubService.getUserProfile(this.username);
    this.userProfile$.subscribe(
      (response) => {
        this.loading = false;
        this.userProfileData = response;
        console.log(response);
        this.userProfileImageUrl = response.avatar_url;
        this.fetchUserTechStack();
      },
      (error) => {
        this.loading = false;
        this.error = error;
      }
    );
  }

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

  navigateToUserProfile(): void {
    const url = `/user/${this.userProfileData.id}`;
    window.location.href = url;
  }
}
