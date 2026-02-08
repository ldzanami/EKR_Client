import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePage {
  user = {
    name: 'George Linkoln',
    avatar: 'https://i.pravatar.cc/80?img=12',
  };

  onLogout() {
    console.log('Logout...');
    // тут потом будет AuthService.logout()
  }
}
