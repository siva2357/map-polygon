import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GoogleMapsModule } from '@angular/google-maps';

import { MapPolygonComponent } from './map-polygon/map-polygon.component';
import { MapPickerComponent } from './map-picker/map-picker.component';
import { MapCasesComponent } from './map-cases/map-cases.component';

@NgModule({
  declarations: [
    AppComponent,
    MapPolygonComponent,
    MapPickerComponent,
    MapCasesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
