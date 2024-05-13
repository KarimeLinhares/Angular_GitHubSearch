import { Component, OnInit, ElementRef } from '@angular/core';
import { GithubApiService } from 'src/app/service/github-api.service';
import { FavoritesService } from 'src/app/service/favorites.service';

@Component({
  selector: 'app-search-api',
  templateUrl: './search-api.component.html',
  styleUrls: ['./search-api.component.scss'],
})
export class SearchApiComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  currentPage: number = 1;
  username: string;
  topTechs: any;

  constructor(
    private githubApiService: GithubApiService,
    private favoritesService: FavoritesService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {}

  //buscar usuário
  searchUsers(): void {
    this.githubApiService
      .searchUsers(this.searchQuery, this.currentPage)
      .subscribe(
        (results: any) => {
          this.searchResults = results.items;
          this.searchResults.forEach((user) => {
            this.githubApiService.getUserRepos(user.login).subscribe(
              (userRepos: any[]) => {
                // Chamando o método para obter as três principais tecnologias
                this.fetchUserTechStack(user.login, userRepos);
                // Verificar se o perfil está favoritado
                user.isProfileFavorited = this.checkProfileFavorite(user.login);
              },
              (error: any) => {
                console.error('Erro ao buscar repositórios do usuário:', error);
              }
            );
          });
        },
        (error: any) => {
          console.error('Erro ao pesquisar usuários:', error);
        }
      );
  }

  //paginação
  nextPage(): void {
    this.currentPage++;
    this.searchUsers();
    this.scrollToTop();
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchUsers();
      this.scrollToTop();
    }
  }

  scrollToTop(): void {
    // Use o elemento nativo para rolar a página para o topo
    this.elementRef.nativeElement.ownerDocument.defaultView.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  //stacks mais usadas
  fetchUserTechStack(username: string, userRepos: any[]): void {
    const techStack = this.githubApiService.getUserTechStack(userRepos);
    const topTechs = this.getTopTechs(techStack, 3);
    console.log(
      'Principais tecnologias para o usuário',
      username,
      ':',
      topTechs
    );
    const user = this.searchResults.find((u) => u.login === username);
    if (user) {
      user.topTechs = topTechs;
    }
  }

  getTopTechs(techStack: { [key: string]: number }, limit: number): string[] {
    const sortedTechStack = Object.entries(techStack).sort(
      (a, b) => b[1] - a[1]
    );
    return sortedTechStack.slice(0, limit).map((entry) => entry[0]);
  }

  checkProfileFavorite(username: string): boolean {
    // Lógica para verificar se o perfil está favoritado
    return this.favoritesService.isFavorite(username);
  }

  //adicionar ou remover favoritos
  addOrRemoveFavorite(username: string): void {
    const user = this.searchResults.find((u) => u.login === username);
    if (user) {
      if (user.isProfileFavorited) {
        // Se já estiver favoritado, remova-o dos favoritos
        this.favoritesService.removeFavorite(username);
      } else {
        // Caso contrário, adicione-o aos favoritos
        this.favoritesService.addFavorite(username);
      }
      // Atualize o estado isProfileFavorited para refletir a mudança
      user.isProfileFavorited = !user.isProfileFavorited;
    }
  }
}
