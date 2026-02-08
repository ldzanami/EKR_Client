import { TestBed } from '@angular/core/testing';
import { RegisterPage } from './register-page.component';

describe('RegisterPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPage],
    }).compileComponents();
  });

  it('should create the RegisterPage', () => {
    const fixture = TestBed.createComponent(RegisterPage);
    const Register = fixture.componentInstance;
    expect(Register).toBeTruthy();
  });
});