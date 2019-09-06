import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LineaInfoComponent } from '../linea-info/linea-info.component';

@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.scss']
})

export class LineasComponent implements OnInit {
  private lineas: object;

  constructor(api: ApiService) {
    api.fetchApi('http://localhost:3000/api/lineas')
      .subscribe(res => {
        this.lineas = res;
      });
  }

  ngOnInit() {

  }

}
