import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineasComponent } from './lineas/lineas.component';
import { LineaInfoComponent } from './linea-info/linea-info.component';
import { NucleosComponent } from './nucleos/nucleos.component';
import { LineaCardComponent } from './linea-card/linea-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LineasComponent,
    LineaInfoComponent,
    NucleosComponent,
    LineaCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
