import { Observable } from 'rxjs';
import { GithubService } from './../../service/github.service';
import { FavoritesService } from 'src/app/service/favorites.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  //propriedade do tipo observable, que irá armazenar o observado retornado pelo service ao buscar os dados de perfil do usuário
  userProfile$: Observable<any>;
  //propriedade do tipo observable, que irá conter os dados da pilha de tecnologias
  techStack$: Observable<any>;
  topTechs$: Observable<any>;
  //propriedade que irá guardar os dados reais retornados da chamada da API do GitHub
  userProfileData: any;
  //propriedade que rastreia se o componente está fazendo load dos dados
  loading: boolean;
  //propriedade usada para armazenar erros
  error: any;
  //propriedade que vai armazenar o valor do input
  username: string;
  //propriedade que vai armazenar a url da imagem de perfil do usuário
  userProfileImageUrl: string;
  isFavorite: boolean;

  constructor(
    private githubService: GithubService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    //setando um username default, e startando os dados dele
    this.username = 'karimelinhares';
    this.fetchUserProfile();
    this.fetchUserTechStack();
    //faz a checagem dos perfis favoritados
    this.isFavorite = this.favoritesService.isFavorite(
      this.userProfileData.login
    );
  }

  //componente que busca os dados do perfil do usuário do GitHub usando o GithubService e os exibe no modelo.
  //também lida com os estados de carregamento e erro.
  fetchUserProfile(): void {
    this.userProfile$ = this.githubService.getUserProfile(this.username);
    this.userProfile$.subscribe(
      (response) => {
        this.loading = false;
        this.userProfileData = response;
        this.userProfileImageUrl = response.avatar_url;
      },
      (error) => {
        this.loading = false;
        this.error = error;
      }
    );
  }

  fetchUserTechStack(): void {
    this.githubService.getUserRepos(this.username).subscribe((repos) => {
      this.techStack$ = this.githubService.getUserTechStack(repos);
    });
  }

  toggleFavorite(): void {
    const userProfileData = this.userProfileData;
    if (this.isFavorite) {
      this.favoritesService.removeFavorite(userProfileData.login);
      this.isFavorite = false;
    } else {
      this.favoritesService.addFavorite(userProfileData.login);
      this.isFavorite = true;
    }
  }
}
