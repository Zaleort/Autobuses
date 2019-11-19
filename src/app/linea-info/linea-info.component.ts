import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiLinea, ApiError } from '../interfaces/api-responses';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-linea-info',
  templateUrl: './linea-info.component.html',
  styleUrls: ['./linea-info.component.scss']
})
export class LineaInfoComponent implements OnInit, OnDestroy {
  id: string;
  name: string;
  url: any;
  horarios: object;
  paradas: string[];
  nucleos: string[];

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.url = this.route.params.subscribe(params => {
      this.id = params['lineaId'];

    this.api.fetchApi('http://localhost:3000/api/lineas/' + this.id)
      .subscribe({
        next: (res: ApiLinea | ApiError) => {
          if (this.api.hasError(res)) {
            console.error(res.error);
            return;
          }

          let linea = res;
          this.name = linea.name;
          this.horarios = linea.horarios;
          this.paradas = linea.paradas;
          this.nucleos = linea.nucleos;

          console.log(linea);
        },

        error: (error) => {
          console.error(error);
        }
      });
    })
  }

  ngOnDestroy() {
    this.url.unsubscribe();
  }

}
