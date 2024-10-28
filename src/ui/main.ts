import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ApiListComponent } from './components/api-list/api-list.component';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'electron-app',
  template: ` <app-api-list></app-api-list>`,
  imports: [ApiListComponent],
  standalone: true,
})
export class ElectronAppComponent implements OnInit, OnDestroy {
  subscription: any;
  messages = signal<string[]>([]);
  data = signal<string>('');

  ngOnInit() {
    this.sampleElectronInteractions();
  }

  sampleElectronInteractions = async () => {
    this.subscription = window.electron.subscribeMessages((message: any) => {
      console.log(message);
      this.messages.set([...this.messages(), message]);
    });
    this.data.set(await window.electron.getData());
  }

  ngOnDestroy(): void {
    this.subscription();
  }
}


bootstrapApplication(ElectronAppComponent, {
  providers: [provideAnimations()],
});



