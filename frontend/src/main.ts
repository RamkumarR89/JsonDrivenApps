import { bootstrapApplication } from '@angular/platform-browser';
import { ModuleRegistry, AllCommunityModule, InfiniteRowModelModule } from 'ag-grid-community';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Register AG Grid modules globally
ModuleRegistry.registerModules([AllCommunityModule, InfiniteRowModelModule]);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
