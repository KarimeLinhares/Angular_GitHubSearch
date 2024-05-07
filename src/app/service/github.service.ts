import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  //Definindo um método que recebe um único parâmetro username do tipo string.
  //O método faz uma requisição GET para a api do github para buscar o perfil do usuário.
  //A requisição é enviada com um cabeçalho "Content-Type" definido como "application/json", e a resposta retorna como um observável.
  getUserProfile(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${username}`, {
      headers: this.headers,
    });
  }
}
