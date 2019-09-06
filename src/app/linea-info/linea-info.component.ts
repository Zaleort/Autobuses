import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-linea-info',
  templateUrl: './linea-info.component.html',
  styleUrls: ['./linea-info.component.scss']
})
export class LineaInfoComponent implements OnInit {
  name: string;
  url: string;
  horarios: object;
  paradas: [];
  municipios: [];

  constructor() { }

  ngOnInit() {
  }

}
