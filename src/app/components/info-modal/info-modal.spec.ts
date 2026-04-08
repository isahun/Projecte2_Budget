import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoModal } from './info-modal';
import { mockBudgetServiceProvider } from '../../testing/mocks';

describe('InfoModal', () => {
  let component: InfoModal;
  let fixture: ComponentFixture<InfoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoModal],
      providers: [mockBudgetServiceProvider]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
