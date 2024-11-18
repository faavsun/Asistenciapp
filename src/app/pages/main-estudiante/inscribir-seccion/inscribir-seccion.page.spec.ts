import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscribirSeccionPage } from './inscribir-seccion.page';

describe('InscribirSeccionPage', () => {
  let component: InscribirSeccionPage;
  let fixture: ComponentFixture<InscribirSeccionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InscribirSeccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
