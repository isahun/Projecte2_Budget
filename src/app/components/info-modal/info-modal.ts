import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-info-modal',
  imports: [],
  template: `
  <div class="overlay" (click)="onClose()">
      <div class="modal" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">×</button>
        <div class="content">
          <h3>Informació</h3>
          <p>{{ text() }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './info-modal.css',
})
export class InfoModal {
  // Rep el text a mostrar del component pare. Si el pare no en passa cap, per defecte és ''. A diferència de input.required(), aquí el valor és opcional
  text = input<string>(''); //signal input, text q enviem desd el pare
  // output<void> perquè no cal enviar cap dada al pare, només avisar que s'ha de tancar. void significa literalment "no envio res, només l'event"
  close = output<void>(); //signal output, avís perquè el pare el tanqui

  onClose() {
    this.close.emit(); // Emetem l'event cap al pare perquè ell amagui el modal
  }
}
