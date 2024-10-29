import { Component } from '@angular/core';
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
export class ApiListComponent {
  selectedSpec = null;

  constructor(public apiSpecService: ApiSpecService) { }

  updateSelectedAPI = (spec: any) => {
    this.selectedSpec = spec;
  }

  startAPIScan = async () => {
    await window.electron.ipcRenderer.invoke('start-api-scan', { ui: 'https://4innovation-impl.cms.gov/auth/login', api: 'https://4innovation-impl-api.cms.gov' });
  }

  export = () => {
    this.apiSpecService.exportSpecsToJson();
  }
}
