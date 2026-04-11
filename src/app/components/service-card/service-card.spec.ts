import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceCard } from './service-card';
import { mockBudgetServiceProvider } from '../../testing/mocks';

describe('ServiceCard', () => {
  let component: ServiceCard;
  let fixture: ComponentFixture<ServiceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCard],
      providers: [mockBudgetServiceProvider]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceCard);
    component = fixture.componentInstance;

    const mockService = {
      id: 'web',
      name: 'Web',
      description: 'Desc',
      price: 500,
      isSelected: false
    }

    fixture.componentRef.setInput('service', mockService)

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
