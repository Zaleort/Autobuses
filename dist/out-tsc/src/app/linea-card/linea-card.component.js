import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
let LineaCardComponent = class LineaCardComponent {
    constructor() { }
    get nucleosNames() {
        return this.nucleos.join(' - ');
    }
    ngOnInit() {
    }
};
tslib_1.__decorate([
    Input()
], LineaCardComponent.prototype, "linea", void 0);
tslib_1.__decorate([
    Input()
], LineaCardComponent.prototype, "nucleos", void 0);
LineaCardComponent = tslib_1.__decorate([
    Component({
        selector: 'app-linea-card',
        templateUrl: './linea-card.component.html',
        styleUrls: ['./linea-card.component.scss']
    })
], LineaCardComponent);
export { LineaCardComponent };
//# sourceMappingURL=linea-card.component.js.map