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
    return this.nucleos.join(' - ');
  }

  constructor() { }

  ngOnInit() {
  }

}
