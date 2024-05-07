import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GithubService } from '../../service/github.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  constructor(private githubService: GithubService) {}
}
