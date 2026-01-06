
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterLink, TranslateModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    // Logic from legacy HomeCtrl
    // $scope.isonline = $window.navigator.onLine;
    isOnline = navigator.onLine;
}
