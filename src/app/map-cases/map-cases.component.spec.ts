import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCasesComponent } from './map-cases.component';

describe('MapCasesComponent', () => {
  let component: MapCasesComponent;
  let fixture: ComponentFixture<MapCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapCasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
