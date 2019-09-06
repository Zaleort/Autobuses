import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NucleosComponent } from './nucleos.component';

describe('MunicipiosComponent', () => {
  let component: NucleosComponent;
  let fixture: ComponentFixture<NucleosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NucleosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NucleosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
