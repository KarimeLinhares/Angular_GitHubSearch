import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubApiService {
  apiUrl: string = 'https://api.github.com';
  apiKey: string = '';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.apiKey}`,
  });
  page: number = 1;

  constructor(private http: HttpClient) {}

  searchUsers(query: string, page: number): Observable<any> {
    const perPage: number = 9;
    const url = `${this.apiUrl}/search/users?q=${query}&per_page=${perPage}&page=${page}`;
    return this.http.get(url, { headers: this.headers });
  }

  getUserProfile(username: string) {
    const url = `${this.apiUrl}/users/${username}`;
    return this.http.get(url, { headers: this.headers });
  }

  getUserRepos(username: string) {
    const url = `${this.apiUrl}/users/${username}/repos`;
    return this.http.get(url, { headers: this.headers });
  }

  getUserTechStack(repos: any[]) {
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

    return techStack;
  }
}
