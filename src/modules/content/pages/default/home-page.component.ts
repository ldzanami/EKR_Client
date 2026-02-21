import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StorageKeyEnum } from '../../../../enums/storage-keys';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePage {
  private router = inject(Router);
  
  public user: { name: string, avatar: string };

  constructor() {
    const sessionData = sessionStorage.getItem(StorageKeyEnum.SESSION_KEY);

    this.user = {
      name: sessionData ? JSON.parse(sessionData).username : 'UserName',
      avatar: 'https://i.pravatar.cc/80?img=12',
    };

  }


  public onLogout() {
    this.router.navigateByUrl('auth/login')
  }
}
