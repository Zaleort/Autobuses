import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LineasComponent } from './lineas/lineas.component';
import { LineaInfoComponent } from './linea-info/linea-info.component';
import { NucleosComponent } from './nucleos/nucleos.component';
const routes = [
    { path: 'lineas', component: LineasComponent },
    { path: 'lineas/:lineaId', component: LineaInfoComponent },
    { path: 'nucleos', component: NucleosComponent },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map