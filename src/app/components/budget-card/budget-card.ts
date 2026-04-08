// input i output són la manera moderna d'Angular (signals) per comunicar components pare-fill
import { Component, input, output } from '@angular/core';
import { Budget } from '../../interfaces/budget.interface';
import { DatePipe } from '@angular/common'; // Pipe d'Angular per formatar dates al template
@Component({
  selector: 'app-budget-card',
  imports: [DatePipe], // Cal importar DatePipe aquí per poder usar-lo al template amb el pipe |
  templateUrl: './budget-card.html',
  styleUrl: './budget-card.css',
})
export class BudgetCard {
  // input.required<Budget>() → el component EXIGEIX rebre un objecte Budget del component pare. Si el pare no el passa, Angular llança un error en temps de compilació.
  budget = input.required<Budget>();

  //output<number>() → aquest component pot emetre esdeveniments cap al pare. Concretament emetrà l'id (number) del pressupost a esborrar. El pare escoltarà amb: (deleteRequest)="alguna funció($event)"
  deleteRequest = output<number>();

  onDelete() {
    // Quan l'usuari clica esborrar, emetem l'id cap al pare perquè ell gestioni l'esborrat. El component fill no sap res de Supabase ni del servei — només avisa el pare. budget() amb parèntesis perquè és un signal input.
    this.deleteRequest.emit(this.budget().id);
  }
}
