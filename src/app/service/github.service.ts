import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private apiUrl = 'https://api.github.com';
  private authToken = ``;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.authToken}`,
  });

  constructor(private http: HttpClient) {}

  getUserProfile(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${username}`, {
      headers: this.headers,
    });
  }

  getUserProfileImage(userProfile: any): Observable<string> {
    return of(userProfile.avatar_url);
  }

  getUserRepos(username: string): Observable<any> {
    return this.http.get(`https://api.github.com/users/${username}/repos`);
  }

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

  searchUsers(query: string): Observable<any[]> {
    const url = `${this.apiUrl}/users?q=${query}&per_page=9`;
    return this.http.get(url).pipe(
      map((response: any) => response.items),
      catchError((error: any) => {
        console.error(error);
        return of([]);
      })
    );
  }
}
