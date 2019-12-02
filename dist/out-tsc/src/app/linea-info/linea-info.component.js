import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let LineaInfoComponent = class LineaInfoComponent {
    constructor(api, route) {
        this.api = api;
        this.route = route;
    }
    ngOnInit() {
        this.url = this.route.params.subscribe(params => {
            this.id = params['lineaId'];
            this.api.fetchApi('http://localhost:3000/api/lineas/' + this.id)
                .subscribe({
                next: (res) => {
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
        });
    }
    ngOnDestroy() {
        this.url.unsubscribe();
    }
};
LineaInfoComponent = tslib_1.__decorate([
    Component({
        selector: 'app-linea-info',
        templateUrl: './linea-info.component.html',
        styleUrls: ['./linea-info.component.scss']
    })
], LineaInfoComponent);
export { LineaInfoComponent };
//# sourceMappingURL=linea-info.component.js.map