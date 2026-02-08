import { TestBed } from '@angular/core/testing';
import { AuthPage } from './auth-page.component';

describe('AuthPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPage],
    }).compileComponents();
  });

  it('should create the AuthPage', () => {
    const fixture = TestBed.createComponent(AuthPage);
    const Auth = fixture.componentInstance;
    expect(Auth).toBeTruthy();
  });
});
