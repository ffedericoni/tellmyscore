import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageService, Game } from '../shared/storage.service';

@Component({
    selector: 'app-games',
    standalone: true,
    imports: [CommonModule, RouterModule, DatePipe, TranslateModule],
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.scss']
})
export class GamesComponent {
    private storage = inject(StorageService);
    private translate = inject(TranslateService);

    // Expose signal directly for template
    games = this.storage.games;

    deleteGame(index: number) {
        const game = this.games()[index];
        const dateStr = new DatePipe(this.translate.currentLang).transform(game.started, 'mediumDate');
        const confirmMsg = this.translate.instant('GAMES.DELETE_CONFIRM_TITLE') + ' ' + dateStr + '?';

        if (confirm(confirmMsg)) {
            this.storage.games.update(currentGames => {
                const newGames = [...currentGames];
                newGames.splice(index, 1);
                return newGames;
            });
        }
    }

    // Helper to safely get total for a player in a specific game
    getGameTotal(game: Game, playerId: string): number {
        return game.totals[playerId] || 0;
    }
}
