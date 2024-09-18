import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepasoconceptosPage } from './repasoconceptos.page';

describe('RepasoconceptosPage', () => {
  let component: RepasoconceptosPage;
  let fixture: ComponentFixture<RepasoconceptosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RepasoconceptosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
