import { Observable } from 'rxjs';
import { GithubService } from './../../service/github.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  //propriedade do tipo observable, que irá armazenar o observado retornado pelo service ao buscar os dados de perfil do usuário
  userProfile$: Observable<any>;
  //propriedade que irá guardar os dados reais retornados da chamada da API do GitHub
  userProfileData: any;
  //propriedade que rastreia se o componente está fazendo load dos dados
  loading: boolean;
  //propriedade usada para armazenar erros
  error: any;
  //propriedade que vai armazenar o valor do input
  username: string;

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    //setando um username default, e buscando os dados dele
    this.username = 'karimelinhares';
    this.fetchUserProfile();
  }

  //componente que busca os dados do perfil do usuário do GitHub usando o GithubService e os exibe no modelo.
  //também lida com os estados de carregamento e erro.
  fetchUserProfile(): void {
    this.userProfile$ = this.githubService.getUserProfile(this.username);
    this.userProfile$.subscribe(
      (response) => {
        this.loading = false;
        this.userProfileData = response;
      },
      (error) => {
        this.loading = false;
        this.error = error;
      }
    );
  }
}
