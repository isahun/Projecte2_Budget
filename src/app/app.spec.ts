import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { mockBudgetServiceProvider } from './testing/mocks';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [mockBudgetServiceProvider]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#calculator-title')?.textContent).toContain('Els nostres serveis web');
  });
});
