import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteHintsComponent } from './autocomplete-hints.component';

describe('AutocompleteHintsComponent', () => {
  let component: AutocompleteHintsComponent;
  let fixture: ComponentFixture<AutocompleteHintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteHintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteHintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
