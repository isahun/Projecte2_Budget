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
  text = input<string>(''); //signal input, text q enviem desd el pare
  close = output<void>(); //signal output, avís perquè el pare el tanqui

  onClose() {
    this.close.emit();
  }
}
