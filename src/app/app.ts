import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App implements OnInit {

  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly authService: AuthService,
  ) {}

  public ngOnInit(): void {
    // this.encryptionService.getPublicKeyRSA();
    console.log('this.authService.refreshAccessToken();');
    this.authService.refreshAccessToken();
  }

}
