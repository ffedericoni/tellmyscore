import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'players', loadComponent: () => import('./players/players.component').then(m => m.PlayersComponent) },
    { path: 'scores', loadComponent: () => import('./scores/scores.component').then(m => m.ScoresComponent) },
    { path: 'games', loadComponent: () => import('./games/games.component').then(m => m.GamesComponent) },
];
