import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCustomizer } from './web-customizer';
import { mockBudgetServiceProvider } from '../../testing/mocks';

describe('WebCustomizer', () => {
  let component: WebCustomizer;
  let fixture: ComponentFixture<WebCustomizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebCustomizer],
      providers: [mockBudgetServiceProvider]
    }).compileComponents();

    fixture = TestBed.createComponent(WebCustomizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
