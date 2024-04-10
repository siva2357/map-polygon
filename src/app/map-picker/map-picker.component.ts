import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.css']
})
export class MapPickerComponent implements OnInit, OnDestroy {

  @ViewChild('map', {static: true}) mapElementRef!: ElementRef;
  center = { lat: 28.649944693035188, lng: 77.23961776224988 };
  map: any;
  markers: any[] = [];
  markerListener: any;
  markerPosition: google.maps.LatLng | null = null;

  mapListener: any;
  savedCoordinates: { lat: number, lng: number }[] = [];
  private renderer = inject(Renderer2);
  private addMarkerButtonClickHandler: any;

  constructor() { }

  ngOnInit(): void {
    this.loadMap();
  }

  async loadMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const mapEl = this.mapElementRef.nativeElement;
    const location = new google.maps.LatLng(this.center.lat, this.center.lng);

    this.map = new Map(mapEl, {
      center: location,
      zoom: 14,
      mapId: "YOUR_MAP_ID",
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    this.renderer.addClass(mapEl, 'visible');
  }

  async addMarkerOnClick() {
    this.markers.forEach(marker => marker.setMap(null)); // Remove existing markers
    this.markers = []; // Clear the markers array
  
    const location = this.map.getCenter();
    this.addMarker(location);
  }
  
  async addMarker(location: any) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  
    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: location,
      gmpDraggable: true,
    });
  
    this.markers.push(marker);
  
    marker.addListener("dragend", (event: any) => {
      const newPosition = event.latLng; // Get the new position
      console.log("Marker dragged to:", newPosition.lat(), newPosition.lng());
      this.markerPosition = newPosition; // Store the new position
    });
  }
  
  

  removeMarkers() {
    for (const marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
    this.savedCoordinates = []; // Clear the saved coordinates
    console.clear(); // Clear the console
    console.log("Markers and their corresponding coordinates have been removed.");
  }
  
  save() {
    if (this.markerPosition) {
      const { lat, lng } = this.markerPosition.toJSON();
      this.savedCoordinates.push({ lat, lng });
      console.log("Saved Marker Coordinates:", lat, lng);
    } else {
      console.log("No marker position to save.");
    }
  }



  





  
  
  ngOnDestroy(): void {
    if(this.mapListener) {
      google.maps.event.removeListener(this.mapListener);
      this.mapListener = null;
    }
  }
}
