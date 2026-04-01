import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { BudgetCalculator } from './components/budget-calculator/budget-calculator';
import { BudgetForm } from './components/budget-form/budget-form';
import { BudgetHistory } from './components/budget-history/budget-history';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, BudgetCalculator, BudgetForm, BudgetHistory],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('budget-app');
}
