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
    accesible: boolean;

    horarios: ApiHorarios;
    tablaHorariosIda: any[];
    tablaHorariosVuelta: any[];

    paradasIda: string[];
    paradasVuelta: string[];
    paradasInfo: ApiParada[];
    
    nucleosIda: string[];
    nucleosVuelta: string[]
    nucleosInfo: ApiNucleo[];
    nucleosList: string[];

    filtroParadaSalida: string;
    filtroParadaDestino: string;
    filtroParadasSalida: ApiParada[];
    filtroParadasDestino: ApiParada[];
    filtroFecha: string;
    filtroHora: string;

    dropdownSalida: boolean = false;
    dropdownDestino: boolean = false;

    hasVuelta: boolean;
    recorrido: string;
    zonas: string[];
    saltos: number;
    duracion: string;

    frecuenciasIda: string[];
    frecuenciasVuelta: string[];

    isReady: boolean = false;

    constructor(private api: ApiService, private route: ActivatedRoute) {}

    getHasVuelta() {
        this.hasVuelta = this.horarios.vuelta != null;
    }

    getRecorrido() {
        const salida = this.nucleosInfo.find(n =>
            n._id === this.nucleosIda[0]).name.toLocaleLowerCase();

        const destino = this.nucleosInfo.find(n =>
            n._id === this.nucleosIda[this.nucleosIda.length - 1]).name.toLocaleLowerCase();
        this.recorrido = `${salida} - ${destino}`;
    }

    getNucleosList() {
        if (this.nucleosIda == null) { return ''; }

        const nucleos = [];
        this.nucleosIda.forEach(nucleo => {
            const n = this.nucleosInfo.find(n => n._id === nucleo);
            nucleos.push(n.name.toLowerCase());
        })

        this.nucleosList = nucleos;
    }

    getZonas() {
        const arr = [];

        this.paradasInfo.forEach(parada => {
            if (!arr.some(z => z === parada.zona)) {
                arr.push(parada.zona);
            }
        })

        this.zonas = arr.sort();
    }

    // @TODO Resolver para casos como M-336
    getDuracion() {
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
            this.duracion = minutos + ' min';
        }

        else {
            const horas = Math.floor(minutos / 60);
            const minutosFinal = minutos - (60 * horas);

            this.duracion = horas + 'h' + ' ' + minutosFinal + ' min';
        }
    }

    hoursToMinutes(hour: string): number {
        const arr = hour.split(':');
        const hourInMinutes = parseInt(arr[0]) * 60;
        const minutes = parseInt(arr[1]);

        return hourInMinutes + minutes;
    }

    getFrecuenciasIda() {
        const frecuencias: Set<string> = new Set();
        const primeraParada = this.paradasIda[0];
        this.horarios.ida[primeraParada].forEach(horario => {
            frecuencias.add(horario.frecuencia);
        })

        this.frecuenciasIda = this.ordenarFrecuencias(Array.from(frecuencias));
    }

    getFrecuenciasVuelta(): string[] {
        if (!this.paradasVuelta) { return []; }
        const frecuencias: Set<string> = new Set();

        const primeraParada = this.paradasVuelta[0];
        this.horarios.vuelta[primeraParada].forEach(horario => {
            frecuencias.add(horario.frecuencia);
        })

        this.frecuenciasVuelta = this.ordenarFrecuencias(Array.from(frecuencias));
    }

    ordenarFrecuencias(frecuencias: string[]): string[] {
        const orden = ['L-D', 'L-S', 'L-VDF', 'L-V', 'S-D-F', 'DF', 'M-S', 'M-V', 'M-J', 'VD', 'L-X-V', 'L', 'V', 'S', 'D'];
        const ordenado = [];

        orden.forEach(f => {
            if (frecuencias.some(frec => frec === f)) {
                ordenado.push(f);
            }
        })

        return ordenado;
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

    setFiltroParadaSalida(parada) {
        this.filtroParadaSalida = parada.target.innerHTML.trim();
    }

    setFiltroParadaDestino(parada) {
        this.filtroParadaDestino = parada.target.innerHTML.trim();
    }

    updateFiltroParadasSalida(): void {
        if (!this.filtroParadaSalida) {
            this.filtroParadasSalida = this.paradasInfo;
        }

        this.filtroParadasSalida = this.paradasInfo.filter(p => p.name.includes(this.filtroParadaSalida.toLocaleUpperCase()));
    }

    updateFiltroParadasDestino(): void {
        if (!this.filtroParadaDestino) {
            this.filtroParadasDestino = this.paradasInfo;
        }

        this.filtroParadasDestino = this.paradasInfo.filter(p => p.name.includes(this.filtroParadaDestino.toLocaleUpperCase()));
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
    getTablaDeHorarios(ida: boolean): any[] {
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

                        console.log(res);

                        this.name = res.name;
                        this.accesible = res.accesible;
                        this.horarios = res.horarios;
                        this.paradasIda = res.paradasIda;
                        this.paradasVuelta = res.paradasVuelta;
                        this.paradasInfo = res.paradasInfo;
                        this.nucleosIda = res.nucleosIda;
                        this.nucleosVuelta = res.nucleosVuelta;
                        this.nucleosInfo = res.nucleosInfo;
                        this.saltos = res.saltos;
                        
                        this.filtroParadasSalida = this.paradasInfo;
                        this.filtroParadasDestino = this.paradasInfo;
                        this.getDuracion();
                        this.getHasVuelta();
                        this.getNucleosList();
                        this.getRecorrido();
                        this.getZonas();
                        this.getFrecuenciasIda();
                        this.getFrecuenciasVuelta();
                        this.tablaHorariosIda = this.getTablaDeHorarios(true);
                        this.tablaHorariosVuelta = this.getTablaDeHorarios(false);

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
