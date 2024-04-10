import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map-polygon',
  templateUrl: './map-polygon.component.html',
  styleUrls: ['./map-polygon.component.css']
})
export class MapPolygonComponent implements OnInit {
  @ViewChild('map', {static: true}) mapElementRef!: ElementRef;
  center = { lat: 28.649944693035188, lng: 77.23961776224988 };
  map!: any;
  polygon!: google.maps.Polygon;
  infoWindow!: google.maps.InfoWindow;
  coordinates: google.maps.LatLngLiteral[] = [];
  tracingEnabled: boolean = false;
  lastClickedCoordinate: string = '';

  ngOnInit(): void {
    this.loadMap();
  }

  async loadMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const mapEl = this.mapElementRef.nativeElement;
    const location = new google.maps.LatLng(this.center.lat, this.center.lng);

    this.map = new Map(mapEl, {
      center: location,
      zoom: 8,
      mapId: "YOUR_MAP_ID",
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    this.infoWindow = new google.maps.InfoWindow();

    // Add click listener to the map
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        this.addCoordinate(event.latLng);
      }
    });
  }

  addCoordinate(latLng: google.maps.LatLng) {
    const coordinate = { lat: latLng.lat(), lng: latLng.lng() };
    this.coordinates.push(coordinate);
    this.updatePolygon();
    if (this.coordinates.length === 1) {
      this.lastClickedCoordinate = `Latitude: ${latLng.lat().toFixed(6)}, Longitude: ${latLng.lng().toFixed(6)}`;
    }
  }

  updatePolygon() {
    if (this.polygon) {
      this.polygon.setMap(null);
    }
    if (this.coordinates.length >= 3) {
      this.polygon = new google.maps.Polygon({
        paths: this.coordinates,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: true,
        draggable: true,
        map: this.map
      });

      this.polygon.addListener('click', (event: google.maps.PolyMouseEvent) => {
        this.showCoordinateInfo(event.latLng);
      });
    }
  }

  showCoordinateInfo(latLng: google.maps.LatLng | null) {
    if (latLng) {
      let contentString =
        "<b>Area Polygon Coordinate</b><br>" +
        "Clicked location: <br>" +
        latLng.lat() + "," + latLng.lng() +
        "<br>";

      this.infoWindow.setContent(contentString);
      this.infoWindow.setPosition(latLng);
      this.infoWindow.open(this.map);
    }
  }

  startTracing() {
    this.tracingEnabled = true;
  }
  
  removeTracedLocation() {
    this.tracingEnabled = false;
    this.coordinates = [];
    this.updatePolygon();
  }
  
  saveLocation() {
    if (this.polygon) {
      const paths = this.polygon.getPath().getArray().map((latLng: any) => {
        return { lat: latLng.lat(), lng: latLng.lng() };
      });
      this.coordinates = paths;
      console.log("Saved Location:", this.coordinates);
    }
  }
}
