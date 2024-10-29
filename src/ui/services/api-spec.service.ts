import { computed, Injectable, signal } from '@angular/core';

export interface ApiSpec {
  path: string;
  title: string;
  count: number;
  openApiSpec: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiSpecService {
  private _apiSpecs = signal<ApiSpec[]>([])

  apiSpecs = computed(() =>
    this._apiSpecs()
  );

  constructor() {
    window.electron.subscribeMessages((message: any) => {
      if (message.type === 'api-specs' && message.data) {
        this.addOrUpdateSpec(message.data);
      }
    });
  }

  // If url is matching then update openapi spec and add the new path to the list
  addOrUpdateSpec = (newSpec: any) => {
    const foundSpec = this._apiSpecs().find((spec) => spec.path === this.specPath(Object.keys(newSpec.paths)[0]));
    if (foundSpec) {
      foundSpec.openApiSpec.paths = Object.assign({}, foundSpec.openApiSpec.paths, newSpec.paths);
      foundSpec.count = Object.keys(foundSpec.openApiSpec.paths).length;
      this._apiSpecs.set([...this._apiSpecs()]);
    } else {
      this._apiSpecs.set([...this._apiSpecs(), { path: this.specPath(Object.keys(newSpec.paths)[0]), title: newSpec.info.title , count: Object.keys(newSpec.paths).length, openApiSpec: newSpec }]);
    }
  }

  specPath = (api: string) => {
    const match = api.match(/^\/([^\/]*)/);
    return match ? match[1] : '';
  }

  exportSpecsToJson = () => {
    const specsJson = JSON.stringify(this.apiSpecs(), null, 2);
    const blob = new Blob([specsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'specs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
