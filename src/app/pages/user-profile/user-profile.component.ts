import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userProfileData: any;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userProfileData = this.route.snapshot.paramMap.get('id');
  }
}
