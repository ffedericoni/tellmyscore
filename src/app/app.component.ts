import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService } from './shared/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  template: `
    <div class="container-fluid wrapper">
      <nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
        <div class="container">
           <a class="navbar-brand" routerLink="home">TellMyScore</a>
           <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                  <a class="nav-link" routerLink="players" routerLinkActive="active">
                    <i class="fa fa-user"></i> {{ 'NAV.PLAYERS' | translate }}
                  </a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" routerLink="scores" routerLinkActive="active">
                    <i class="fa fa-pencil-square-o"></i> {{ 'NAV.SCORES' | translate }}
                  </a>
              </li>
               <li class="nav-item">
                  <a class="nav-link" routerLink="games" routerLinkActive="active">
                    <i class="fa fa-trophy"></i> {{ 'NAV.GAMES' | translate }}
                  </a>
              </li>
           </ul>
        </div>
      </nav>
      <div class="container">
          <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="footer mt-auto py-3">
        <div class="container">
            <p class="text-muted">
                Made with <span style="color: #e25555;">&hearts;</span> by 
                <a href="https://github.com/ffedericoni">Fabrizio Federiconi</a>. 
                Original concept by <a href="https://github.com/flack">flack</a>.
                <br>
                <small>v2.0.0 - Powered by Angular v19</small>
            </p>
        </div>
    </footer>
  `,
  styles: [],
})
export class AppComponent {
  title = 'TellMyScore';
  private translate = inject(TranslateService);
  private storage = inject(StorageService);

  constructor() {
    this.translate.setDefaultLang('en');

    const savedLang = this.storage.tts().language;
    const code = savedLang ? savedLang.substring(0, 2) : 'en';
    this.translate.use(code);
  }
}
