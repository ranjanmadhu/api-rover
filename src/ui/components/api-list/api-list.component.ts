import { Component, OnInit } from '@angular/core';
import { ApiSpecService } from '../../services/api-spec.service';
import { SwaggerUIComponent } from '../swagger-ui/swagger-ui.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-api-list',
  standalone: true,
  imports: [
    SwaggerUIComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  templateUrl: './api-list.component.html',
  styleUrl: './api-list.component.scss',
})
export class ApiListComponent implements OnInit {
  specs: Array<any> = [];
  selectedSpec = null;
  constructor(private apiSpecService: ApiSpecService) { }
  ngOnInit(): void {
    this.specs = this.apiSpecService.getSpecs();
    this.selectedSpec = this.specs[0];
  }

  updateSelectedAPI = (spec: any) => {
    console.log(spec);
    this.selectedSpec = spec;
  }
}
