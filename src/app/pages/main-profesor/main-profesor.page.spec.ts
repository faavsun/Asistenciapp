import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainProfesorPage } from './main-profesor.page';

describe('MainProfesorPage', () => {
  let component: MainProfesorPage;
  let fixture: ComponentFixture<MainProfesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MainProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
