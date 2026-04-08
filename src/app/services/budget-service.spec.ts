import { TestBed } from '@angular/core/testing';
import { BudgetService } from './budget-service';

describe('BudgetService - Gherkin Scenarios', () => {
  let service: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetService);
  });

  // ESCENARI 1: Càlcul bàsic amb extres de la web
  it('should calculate the total price including web customization extras', () => {
    // GIVEN: L'usuari selecciona el servei "Web"
    service.updateServiceSelection('web'); // Preu base: 500€

    // WHEN: L'usuari afegeix 2 pàgines i 3 idiomes
    service.numPages.set(2);
    service.numLanguages.set(3);

    // THEN: El preu total ha de ser 500 + ((2 + 3) * 30) = 650€
    expect(service.totalPrice()).toBe(650);
  });

  // ESCENARI 2: Reset de filtres
  it('should reset filters to default values', () => {
    // GIVEN: L'usuari ha escrit una cerca i ha canviat l'ordre
    service.searchTerm.set('Irene');
    service.sortBy.set('name');

    // WHEN: Es prem el botó de netejar
    service.resetFilters();

    // THEN: Els valors tornen als originals
    expect(service.searchTerm()).toBe('');
    expect(service.sortBy()).toBe('date');
  });
});
