import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppJsonViewerComponent } from './app-json-viewer.component';

describe('AppJsonViewerComponent', () => {
  let component: AppJsonViewerComponent;
  let fixture: ComponentFixture<AppJsonViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppJsonViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppJsonViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
