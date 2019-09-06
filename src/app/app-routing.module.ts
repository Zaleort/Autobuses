import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LineasComponent } from './lineas/lineas.component';
import { LineaInfoComponent } from './linea-info/linea-info.component';
import { MunicipiosComponent } from './municipios/municipios.component';

const routes: Routes = [
  { path: 'lineas', component: LineasComponent },
  { path: 'lineas/:lineaId', component: LineaInfoComponent },
  { path: 'municipios', component: MunicipiosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
