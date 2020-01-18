import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiLinea, ApiError, ApiNucleo } from '../interfaces/api-responses';

@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.scss']
})

export class LineasComponent implements OnInit {
  private lineas: ApiLinea[];
  private nucleos: ApiNucleo[];
  private filteredLineas: ApiLinea[];

  constructor(private api: ApiService) {}

  getNucleosNames(nucleos: string[]) {
    if(!nucleos) { return; }

    let nucleosNames: string[] = [];

    nucleos.forEach(nucleo => {
      const val = this.nucleos.find(n => n._id === nucleo);
      nucleosNames.push(val.name);
    })

    return nucleosNames;
  }

  updateLineas(search: HTMLInputElement) {
    const value = search.value.trim().toUpperCase();

    // Si la caja de búsqueda está vacía, mostrar todas las líneas
    if (!value || value === '') {
      this.filteredLineas = this.lineas;
      return;
    }

    const filtered = [];

    // Buscar coincidencias en destinos
    this.lineas.forEach(linea => {
      if (linea.nucleosInfo.some(n => n.name.includes(value))) {
        filtered.push(linea);
      }
    });

    // Buscar coincidencias en paradas
    const restantes = this.lineas.filter(l => !filtered.includes(l));
    restantes.forEach(linea => {
      if (linea.paradasInfo.some(p => p.name.includes(value))) {
        filtered.push(linea);
      }
    })

    this.filteredLineas = filtered;
  }

  ngOnInit() {
    this.api.fetchApi('http://localhost:3000/api/nucleos')
      .subscribe({
        next: (res: ApiNucleo[] | ApiError) => {
          if (this.api.hasError(res)) {
            console.error(res.error);
            return;
          }

          this.nucleos = res;
          console.log(this.nucleos);

          this.api.fetchApi('http://localhost:3000/api/lineas')
          .subscribe({
            next: (res: ApiLinea[] | ApiError) => {
              if (this.api.hasError(res)) {
                console.error(res.error);
                return;
              }
      
              this.lineas = res;
              this.filteredLineas = this.lineas;
              console.log(this.lineas);
            },
      
            error: (error) => {
              console.error(error);
            }
          });
        },

        error: (error) => {
          console.error(error);
        }
      });
  }
}
