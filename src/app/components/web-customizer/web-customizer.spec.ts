import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCustomizer } from './web-customizer';

describe('WebCustomizer', () => {
  let component: WebCustomizer;
  let fixture: ComponentFixture<WebCustomizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebCustomizer],
    }).compileComponents();

    fixture = TestBed.createComponent(WebCustomizer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
