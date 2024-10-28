import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import SwaggerUI from 'swagger-ui';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AppJsonViewerComponent } from '../app-json-viewer/app-json-viewer.component';

@Component({
  selector: 'app-swagger-ui',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTabsModule, AppJsonViewerComponent],
  templateUrl: './swagger-ui.component.html',
  styleUrls: ['./swagger-ui.component.scss'],
})
export class SwaggerUIComponent implements AfterViewInit, OnChanges {

  @Input() spec: any;
  @ViewChild('swaggerContainer', { static: true })
  swaggerContainer!: ElementRef;

  private swaggerUI: any;

  ngAfterViewInit() {
    this.initSwaggerUI();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initSwaggerUI();   
  }

  private initSwaggerUI() {
    this.swaggerUI = SwaggerUI({
      domNode: this.swaggerContainer.nativeElement,
      deepLinking: true,
      layout: 'BaseLayout',
      spec: this.spec,
    });
  }
}
