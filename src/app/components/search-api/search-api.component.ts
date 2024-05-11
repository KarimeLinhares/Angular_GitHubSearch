import { Component, OnInit } from '@angular/core';
import { GithubApiService } from 'src/app/service/github-api.service';

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

  constructor(private githubApiService: GithubApiService) {}

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
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchUsers();
    }
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
}
