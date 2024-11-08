import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainEstudiantePage } from './main-estudiante.page';

describe('MainEstudiantePage', () => {
  let component: MainEstudiantePage;
  let fixture: ComponentFixture<MainEstudiantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MainEstudiantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
