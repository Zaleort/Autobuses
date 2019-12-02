import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let LineasComponent = class LineasComponent {
    constructor(api) {
        this.api = api;
    }
    getNucleosNames(nucleos) {
        if (!nucleos) {
            return;
        }
        let nucleosNames = [];
        nucleos.forEach(nucleo => {
            nucleosNames.push(this.nucleos[nucleo].name);
        });
        return nucleosNames;
    }
    ngOnInit() {
        this.api.fetchApi('http://localhost:3000/api/nucleos')
            .subscribe({
            next: (res) => {
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
            next: (res) => {
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
};
LineasComponent = tslib_1.__decorate([
    Component({
        selector: 'app-lineas',
        templateUrl: './lineas.component.html',
        styleUrls: ['./lineas.component.scss']
    })
], LineasComponent);
export { LineasComponent };
//# sourceMappingURL=lineas.component.js.map