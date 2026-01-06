import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StorageService, Player } from '../shared/storage.service';

@Component({
    selector: 'app-players',
    standalone: true, // v19 default
    imports: [CommonModule, FormsModule, RouterModule, TranslateModule], // Add DragDropModule later if needed
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.scss']
})
export class PlayersComponent {
    private storage = inject(StorageService);

    // Expose signal directly or as readonly
    players = this.storage.players;

    newPlayerName = '';

    addPlayer() {
        if (!this.newPlayerName) return;

        const current = this.players();
        const newPlayer: Player = {
            id: 'player' + current.length + '_' + Date.now(), // unique ID better than index
            name: this.newPlayerName
        };

        // Update signal
        this.storage.players.update(p => [...p, newPlayer]);
        this.newPlayerName = '';
    }

    updatePlayer(player: Player) {
        this.storage.savePlayers(); // Trigger save manually if not auto-effect via signal update
        // With signals, if we mutate object inside array, signal might not notify unless we use .mutate or replace array.
        // Better pattern: immutable update.
        // But for now, effect() in service watches the signal. If we mutate content, we might need a signal update.
        this.storage.players.update(p => [...p]); // Trigger effect
    }

    removePlayer(player: Player) {
        this.storage.players.update(p => p.filter(x => x.id !== player.id));
    }
}
