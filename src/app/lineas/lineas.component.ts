import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { LineaInfoComponent } from '../linea-info/linea-info.component';
import { ApiLineas, ApiError } from '../interfaces/api-responses';


@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.scss']
})

export class LineasComponent implements OnInit {
  private lineas: ApiLineas;

  constructor(api: ApiService) {
    api.fetchApi('http://localhost:3000/api/lineas')
      .subscribe((res: ApiLineas | ApiError) => {
        if (res.error) {
          console.log(res.error);
        } else {
          this.lineas = res as ApiLineas;
        }
      });
  }

  ngOnInit() {

  }

}
