import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  //Configurando propriedade privada apiUrl para a URL base da API do Github.
  //Esta URL será utilizada como a URL base para todas as requisições de API feitas por este serviço
  private apiUrl = 'https://api.github.com';
  //Configurando propriedade privada "headers" como uma nova instância de HttpHeader.
  //O objeto HttpHeaders é inicializado com um único cabeçalho, "Content-Type", definido como "application/json".
  //Este cabeçalho especifica que o corpo da requisição deve ser enviado no formato JSON.
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  //propriedade que armazena a URL da API do GitHub para buscar os dados do usuário
  private userProfileUrl = `${this.apiUrl}/users/{username}`;

  constructor(private http: HttpClient) {}

  //Definindo um método que recebe um único parâmetro username do tipo string.
  //O método faz uma requisição GET para a api do github para buscar o perfil do usuário.
  //A requisição é enviada com um cabeçalho "Content-Type" definido como "application/json", e a resposta retorna como um observável.
  getUserProfile(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${username}`, {
      headers: this.headers,
    });
  }

  //método que usa a propriedade "userProfileUrl" e adiciona o sufixo "/avatar_url" para formar a URL completa da imagem de perfil do usuário
  //retorna um observable que emite a URL da imagem de perfil do usuário quando a solicitação é concluída com sucesso
  getUserProfileImage(userProfile: any): Observable<string> {
    return of(userProfile.avatar_url);
  }

  //método busca os repositórios do usuário na API do GitHub
  getUserRepos(username: string): Observable<any> {
    return this.http.get(`https://api.github.com/users/${username}/repos`);
  }

  //método analisa as tecnologias usadas nesses repositórios e retorna um objeto que mapeia cada tecnologia para o número de repositórios que a utilizam
  getUserTechStack(repos: any[]): Observable<any> {
    const techStack: { [key: string]: number } = {};

    repos.forEach((repo) => {
      if (repo.language) {
        techStack[repo.language] = (techStack[repo.language] || 0) + 1;
      }
      if (repo.topics) {
        repo.topics.forEach((topic) => {
          techStack[topic] = (techStack[topic] || 0) + 1;
        });
      }
    });
    return of(techStack);
  }
}
