import 'zone.js';
import 'font-awesome/css/font-awesome.css';
import './styles.scss';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

console.log('Main logic test with imports');

bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
