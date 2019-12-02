import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiLinea, ApiError, ApiParada, ApiNucleo, ApiHorarios, ApiHorario } from '../interfaces/api-responses';
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
    paradasIda: string[];
    paradasVuelta: string[];
    paradasInfo: ApiParada[];
    nucleosIda: string[];
    nucleosVuelta: string[]
    nucleosInfo: ApiNucleo[];

    isReady = false;

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    get hasVuelta() {
        return this.horarios.vuelta !== null;
    }

    get recorrido() {
        const salida = this.nucleosInfo.find(n =>
            n._id === this.nucleosIda[0]).name.toLocaleLowerCase();

        const destino = this.nucleosInfo.find(n =>
            n._id === this.nucleosIda[this.nucleosIda.length - 1]).name.toLocaleLowerCase();
        return `${salida} - ${destino}`;
    }

    get nucleosList(): string {
        if (this.nucleosIda == null) { return ''; }

        const nucleosList = [];
        this.nucleosIda.forEach(nucleo => {
            const n = this.nucleosInfo.find(n => n._id === nucleo);
            nucleosList.push(n.name);
        })

        return nucleosList.join(', ').toLowerCase();
    }

    get saltos(): number {
        if (this.paradasIda == null) { return 0; }

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

    // @TODO Resolver para casos como M-336
    get duracion(): string {
        if (this.horarios == null) { return '?'; }
        const primera = this.paradasIda[0];
        const ultima = this.paradasIda[this.paradasIda.length - 1];

        for (var i = 0; i < this.horarios.ida[primera].length; i++) {
            var horaPrimera = this.horarios.ida[primera][i].hora;
            var horaUltima = this.horarios.ida[ultima][i].hora;

            if (horaPrimera === '--' || horaUltima === '--') {
                continue;
            }

            break;
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
        const arr = hour.split(':');
        const hourInMinutes = parseInt(arr[0]) * 60;
        const minutes = parseInt(arr[1]);

        return hourInMinutes + minutes;
    }

    get frecuenciasIda(): string[] {
        const frecuencias: Set<string> = new Set();
        const primeraParada = this.paradasIda[0];
        this.horarios.ida[primeraParada].forEach(horario => {
            frecuencias.add(horario.frecuencia);
        })

        return Array.from(frecuencias);
    }

    get frecuenciasVuelta(): string[] {
        if (!this.paradasVuelta) { return []; }
        const frecuencias: Set<string> = new Set();

        const primeraParada = this.paradasVuelta[0];
        this.horarios.vuelta[primeraParada].forEach(horario => {
            frecuencias.add(horario.frecuencia);
        })

        return Array.from(frecuencias);
    }

    normalizeFrecuencias(frecuencia: string): string {
        switch (frecuencia) {
            case 'L': {
                return 'Solo Lunes';
            }

            case 'L-D': {
                return 'Diario';
            }

            case 'L-V': {
                return 'Lunes a Viernes';
            }

            case 'L-S': {
                return 'Lunes a Sábados';
                break;
            }

            case 'L-VDF': {
                return 'Lunes a Viernes y Domingos';
            }

            case 'L-X-V': {
                return 'Lunes, Miércoles y Viernes';
            }

            case 'M-J': {
                return 'Martes y Jueves';
            }

            case 'M-V': {
                return 'Martes a Viernes';
            }

            case 'M-S': {
                return 'Martes a Sábados';
            }

            case 'V': {
                return 'Viernes';
            }

            case 'VD': {
                return 'Viernes y Domingos';
            }

            case 'S': {
                return 'Sábados';
            }

            case 'S-D-F': {
                return 'Sábados, Domingos y festivos';
            }

            case 'D': {
                return 'Domingos';
            }

            case 'DF': {
                return 'Domingos y festivos';
            }

            default: {
                console.log('No se reconoce ' + frecuencia);
            }
        }
    }


    /*
      horario = [
        {
          frecuencia: ,
          paradas: [
            {
              id, name, zona, 
              horario: []
            }
          ]
        },
        {
          ...
        }
      ]
    */
    getTablaDeHorarios(ida: boolean) {
        const horario = [];
        let paradas;
        let frecuencias;
        let horarios;

        if (ida) {
            paradas = this.paradasIda;
            frecuencias = this.frecuenciasIda;
            horarios = this.horarios.ida;
        }

        else {
            paradas = this.paradasVuelta;
            frecuencias = this.frecuenciasVuelta;
            horarios = this.horarios.vuelta;
        }

        for (var i = 0; i < frecuencias.length; i++) {
            const frecuencia = frecuencias[i];
            horario.push({ frecuencia, paradas: [] });

            for (var j = 0; j < paradas.length; j++) {
                let { name, zona } = this.paradasInfo.find(p => p._id === paradas[j]);;

                let parada = {
                    id: paradas[j],
                    name,
                    zona,
                    horario: [],
                }

                horarios[paradas[j]].forEach(hora => {
                    if (hora.frecuencia === frecuencias[i] && hora.hora !== '--') {
                        parada.horario.push(hora.hora);
                    }
                })

                if (parada.horario.length > 0) {
                    horario[i].paradas.push(parada);
                }
            }
        }

        console.log(horario);
        return horario;
    }

    getParadaName(_id: string): string {
        const parada = this.paradasInfo.find(p => { return p._id === _id });

        if (!parada) {
            console.warn('No se encuentra la parada con ID: ' + _id);
        }

        else {
            return parada.name;
        }
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
                        this.paradasIda = res.paradasIda;
                        this.paradasVuelta = res.paradasVuelta;
                        this.paradasInfo = res.paradasInfo;
                        this.nucleosIda = res.nucleosIda;
                        this.nucleosVuelta = res.nucleosVuelta;
                        this.nucleosInfo = res.nucleosInfo;

                        this.isReady = true;
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
