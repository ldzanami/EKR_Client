import { TestBed } from '@angular/core/testing';
import { HomePage } from './home-page.component';

describe('HomePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
    }).compileComponents();
  });

  it('should create the HomePage', () => {
    const fixture = TestBed.createComponent(HomePage);
    const Home = fixture.componentInstance;
    expect(Home).toBeTruthy();
  });
});
