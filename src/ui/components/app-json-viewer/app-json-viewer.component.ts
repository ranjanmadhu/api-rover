import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'json-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-json-viewer.component.html',
  styleUrl: './app-json-viewer.component.scss'
})
export class AppJsonViewerComponent {
  @Input() data: any = {
    name: "Sample Project",
    version: "1.0.0",
    description: "A demo JSON object",
    dependencies: {
      angular: "^16.0.0",
      typescript: "^5.0.0"
    },
    scripts: {
      start: "ng serve",
      build: "ng build",
      test: "ng test"
    },
    author: {
      name: "John Doe",
      email: "john@example.com"
    },
    nested: {
      level1: {
        level2: {
          value: "Deeply nested value"
        }
      }
    }
  };

  objectToArray(obj: any): Array<{ key: string, value: any }> {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

  getValueType(value: any): string {
    if (value === null) return 'null';
    if (typeof value === 'object') return 'object';
    return typeof value;
  }
}
