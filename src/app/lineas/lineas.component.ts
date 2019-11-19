import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiLineas, ApiError, ApiNucleos } from '../interfaces/api-responses';

@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.scss']
})

export class LineasComponent implements OnInit {
  private lineas: ApiLineas;
  private nucleos: ApiNucleos;

  constructor(private api: ApiService) {}

  getNucleosNames(nucleos: string[]) {
    if(!nucleos) { return; }

    let nucleosNames: string[] = [];

    nucleos.forEach(nucleo => {
      nucleosNames.push(this.nucleos[nucleo].name);
    })

    return nucleosNames;
  }

  ngOnInit() {
    this.api.fetchApi('http://localhost:3000/api/nucleos')
      .subscribe({
        next: (res: ApiNucleos | ApiError) => {
          if (this.api.hasError(res)) {
            console.error(res.error);
            return;
          }

          this.nucleos = res;
          console.log(this.nucleos);
        },

        error: (error) => {
          console.error(error);
        }
      });

    this.api.fetchApi('http://localhost:3000/api/lineas')
      .subscribe({
        next: (res: ApiLineas | ApiError) => {
          if (this.api.hasError(res)) {
            console.error(res.error);
            return;
          }
  
          this.lineas = res;
          console.log(this.lineas);
        },
  
        error: (error) => {
          console.error(error);
        }
      });
  }
}
