import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiLinea, ApiError, ApiParada, ApiNucleo, ApiHorarios } from '../interfaces/api-responses';
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
  horarios: ApiHorarios;
  paradas: string[];
  paradasInfo: ApiParada[];
  nucleos: string[];
  nucleosInfo: ApiNucleo[];

  isReady = false;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  get nucleosList() {
    if (this.nucleos == null) { return ''; }

    const nucleosList = [];
    this.nucleos.forEach(nucleo => {
      const n = this.nucleosInfo.find(n => n._id === nucleo);
      nucleosList.push(n.name);
    })

    return nucleosList.join(', ').toLowerCase();
  }

  get saltos() {
    if (this.paradas == null) { return ''; }

    let saltos: number = -1;
    let zonas: string[] = [];

    this.paradasInfo.forEach(parada => {
      if (!zonas.some(z => z === parada.zona)) {
        zonas.push(parada.zona);
        saltos++;
      }
    })

    return saltos;
  }

  get duracion() {
    if (this.horarios == null) { return '?'; }
    const primera = this.paradas[0];
    const horaPrimera = this.horarios.ida[primera][0].hora;
    let horaUltima: string;

    for (var i = this.paradas.length - 1; i > 0; i--) {
      const p = this.paradas[i];
      const ida = this.horarios.ida

      if (ida[p] && ida[p][0].hora !== '--') {
        horaUltima = ida[p][0].hora;
        break;
      }
    }

    const minutosPrimera = this.hoursToMinutes(horaPrimera);
    const minutosUltima = this.hoursToMinutes(horaUltima);

    const minutos = minutosUltima - minutosPrimera;
    if (minutos < 60) {
      return minutos + ' min';
    } 
    
    else {
      const horas = Math.floor(minutos / 60);
      const minutosFinal = minutos - (60 * horas);

      return horas + 'h' + ' ' + minutosFinal + ' min';
    }
  }

  hoursToMinutes(hour: string): number {
    console.log(hour);
    const arr = hour.split(':');
    const hourInMinutes = parseInt(arr[0]) * 60;
    const minutes = parseInt(arr[1]);

    return hourInMinutes + minutes;
  }

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

          this.name = res.name;
          this.horarios = res.horarios;
          this.paradas = res.paradas;
          this.paradasInfo = res.paradasInfo;
          this.nucleos = res.nucleos;
          this.nucleosInfo = res.nucleosInfo;

          this.isReady = true;

          console.log(res);
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
