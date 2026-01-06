import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="container">
      <nav class="navbar navbar-default" role="navigation">
        <div class="navbar-header">
           <a class="navbar-brand" href="#">Scorekeeper</a>
        </div>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
    styles: [],
})
export class AppComponent {
    title = 'scorekeeper';
}
