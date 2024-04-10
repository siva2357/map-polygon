import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';


declare var google: any;

@Component({
  selector: 'app-map-cases',
  templateUrl: './map-cases.component.html',
  styleUrls: ['./map-cases.component.css']
})
export class MapCasesComponent implements OnInit, OnDestroy {
  @ViewChild('map', {static: true}) mapElementRef!: ElementRef;
  center = { lat: 28.649944693035188, lng: 77.23961776224988 };
  map!: any;
  markers: any[] = [];
  // markerListener: any;
  markerPosition: google.maps.LatLng | null = null;
  savedCoordinates: { lat: number, lng: number }[] = [];
  coordinates: google.maps.LatLngLiteral[] = [];
  tracingEnabled: boolean = false;
  lastClickedCoordinate: string = '';
  polygon: google.maps.Polygon | null = null;
  infoWindow: google.maps.InfoWindow | null = null;
  mapPickerModeActive: boolean = false;
  traceLocationModeActive: boolean = false;
  
  mapListener: any;

  

  ngOnInit(): void {
    this.loadMap();
  }



  ngOnDestroy(): void {
    if (this.mapListener) {
      google.maps.event.removeListener(this.mapListener);
      this.mapListener = null;
    }
  }

  async loadMap() {
    const { Map} = await google.maps.importLibrary("maps");
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

    this.infoWindow = new google.maps.InfoWindow();

    this.mapListener = this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (this.mapPickerModeActive && this.markers.length === 0) {
        this.addMarker(event.latLng!);
        this.mapPickerModeActive = false;
      } else if (this.traceLocationModeActive) {
        this.addCoordinate(event.latLng!);
      }
    }, { passive: true });
    
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

  addMarkerOnClick() {
    this.markers.forEach(marker => marker.setMap(null)); // Remove existing markers
    this.markers = []; // Clear the markers array
  
    const location = this.map.getCenter();
    this.addMarker(location);
  }

  removeMarkers() {
    for (const marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
    this.savedCoordinates = [];
    console.clear();
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
  
  startMapPickerMode() {
    this.mapPickerModeActive = true;
    this.traceLocationModeActive = false;
    this.removeMarkers();
    this.coordinates = [];
    this.polygon?.setMap(null);
    this.polygon = null;
  }
  
  startTracing() {
    this.traceLocationModeActive = true;
    this.mapPickerModeActive = false;
    this.removeMarkers();
  }

  async addCoordinate(latLng: google.maps.LatLng) {
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
    if (this.coordinates.length >= 0) {
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
  
      this.polygon?.addListener('click', (event: google.maps.PolyMouseEvent) => {
        this.showCoordinateInfo(event.latLng);
      });
    }
  }

  showCoordinateInfo(latLng: google.maps.LatLng | null) {
    if (latLng && this.infoWindow) {
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

  removeTracedLocation() {
    this.traceLocationModeActive = true;
    this.coordinates = [];
    if (this.polygon) {
      this.polygon.setMap(null);
      this.polygon = null;
    }
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




  getLatLngFromTouchEvent(event: TouchEvent): google.maps.LatLng | null {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const point = new google.maps.Point(touch.clientX, touch.clientY);
      return this.map.getProjection().fromContainerPixelToLatLng(point);
    }
    return null;
  }
}
