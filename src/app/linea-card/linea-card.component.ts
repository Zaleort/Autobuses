import { Component, OnInit, Input } from '@angular/core';
import { ApiLinea } from '../interfaces/api-responses';

@Component({
  selector: 'app-linea-card',
  templateUrl: './linea-card.component.html',
  styleUrls: ['./linea-card.component.scss']
})
export class LineaCardComponent implements OnInit {
  @Input() linea: ApiLinea;
  @Input() nucleos: string[];

  get nucleosNames() {
    return this.nucleos.join(', ');
  }

  get recorrido() {
    const salida = this.nucleos[0].toLocaleLowerCase();
    const destino = this.nucleos[this.nucleos.length - 1].toLocaleLowerCase();
    return `${salida} - ${destino}`;
  }

  constructor() { }

  ngOnInit() {
  }

}
