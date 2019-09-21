import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPlayerComponent } from './demo-player.component';

describe('DemoPlayerComponent', () => {
  let component: DemoPlayerComponent;
  let fixture: ComponentFixture<DemoPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
