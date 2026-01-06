import { Component, inject, computed, signal, effect } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StorageService, Player } from '../shared/storage.service';

import { SettingsComponent } from './settings/settings.component';

@Component({
    selector: 'app-scores',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, SettingsComponent, TranslateModule],
    templateUrl: './scores.component.html',
    styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {
    private storage = inject(StorageService);

    // Signals
    players = this.storage.players;
    title = this.storage.title;
    rows = this.storage.rows;
    started = this.storage.started;
    finished = this.storage.finished;
    tts = this.storage.tts;

    // Local state
    running = computed(() => !!this.started() && !this.finished());
    activeRowIndex = signal<number>(-1);
    winners = signal<string[]>([]);
    totals = signal<{ [key: string]: number }>({});
    announcementText = signal('');
    showSettings = signal(false);

    constructor() {
        // Init logic
        effect(() => {
            if (this.rows().length > 0) {
                this.recalculateTotals();
            }
        });

        effect(() => {
            if (this.started() && !this.finished()) {
                // running state
            }
        });
    }

    start() {
        this.storage.rows.set([]);
        this.storage.finished.set(null);
        this.storage.started.set(new Date().toISOString());
        this.winners.set([]);
        this.newRow();
    }

    resume() {
        // Legacy logic: popped game from history?
        // Here we just resume current state if stored.
        // If "resume" means restore from history stack (which we haven't ported fully yet), skip for now.
        // Assuming just continuing.
        this.storage.finished.set(null);
        this.newRow(); // ensure input
    }

    abort() {
        this.storage.started.set(null);
        this.storage.finished.set(null);
        this.storage.rows.set([]);
        this.winners.set([]);
        this.totals.set({});
    }

    finish() {
        this.storage.finished.set(new Date().toISOString());
        // Save to history (games array)
        const game = {
            title: this.title(),
            started: this.started(),
            finished: this.finished(),
            players: this.players(), // copy?
            totals: this.totals()
        };
        this.storage.games.update(g => [game, ...g]);

        // Clean empty rows
        this.cleanupEmptyRows();
        this.calculateWinners();
    }

    newRow() {
        const newRow: any = {};
        for (const p of this.players()) {
            newRow[p.id] = '';
        }
        this.storage.rows.update(r => [...r, newRow]);
        // Focus logic would go here (ViewChild)
    }

    updateTotals(player: Player) {
        this.recalculateTotals();
        this.storage.rows.update(r => [...r]); // Trigger save
    }

    private recalculateTotals() {
        const newTotals: { [key: string]: number } = {};
        for (const p of this.players()) {
            let sum = 0;
            for (const row of this.rows()) {
                sum += this.parseScore(row[p.id]);
            }
            newTotals[p.id] = sum;
        }
        this.totals.set(newTotals);
        this.calculateWinners(); // Live winner update?
    }

    calculateWinners() {
        let max = -Infinity;
        let winners: string[] = [];
        const t = this.totals();
        for (const pid in t) {
            if (t[pid] > max) {
                max = t[pid];
                winners = [pid];
            } else if (t[pid] === max) {
                winners.push(pid);
            }
        }
        this.winners.set(winners);
    }

    cleanupEmptyRows() {
        // Remove last row if empty
        const rows = this.rows();
        if (rows.length > 0 && this.isRowEmpty(rows[rows.length - 1])) {
            this.storage.rows.update(r => r.slice(0, -1));
        }
    }

    isRowEmpty(row: any) {
        for (const k in row) {
            if (this.parseScore(row[k]) !== 0) return false;
        }
        return true;
    }

    parseScore(val: any): number {
        if (!val) return 0;
        if (typeof val === 'string') {
            val = val.replace(',', '.');
        }
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    }

    // TTS Logic partial port
    announce() {
        // Prepare data
        const currentTotals = this.totals();
        const sortedPlayers = [...this.players()].map(p => ({
            name: p.name,
            score: currentTotals[p.id] || 0
        })).sort((a, b) => b.score - a.score);

        // Determine language
        const ttsSettings = this.tts();
        let lang = ttsSettings?.language;

        if (!lang) {
            const browserLang = navigator.language;
            lang = (browserLang && browserLang.indexOf('it') === 0) ? 'it-IT' : 'en-US';
        }

        // Construct text
        let text = "";
        if (lang === 'it-IT') {
            text = "I punteggi attuali sono: ";
            for (const p of sortedPlayers) {
                const unit = (p.score === 1) ? " punto. " : " punti. ";
                text += `${p.name} con ${p.score}${unit}`;
            }
        } else {
            text = "The current scores are: ";
            for (const p of sortedPlayers) {
                const unit = (p.score === 1) ? " point. " : " points. ";
                text += `${p.name} with ${p.score}${unit}`;
            }
        }

        this.announcementText.set(text);

        // Speak
        if ('speechSynthesis' in window) {
            // Cancel any current speaking
            window.speechSynthesis.cancel();

            setTimeout(() => {
                const msg = new SpeechSynthesisUtterance(text);
                msg.rate = ttsSettings?.rate || 0.8;
                msg.pitch = ttsSettings?.pitch || 1;
                msg.lang = lang;

                if (ttsSettings?.voiceURI) {
                    const voices = window.speechSynthesis.getVoices();
                    const voice = voices.find(v => v.voiceURI === ttsSettings.voiceURI);
                    if (voice) msg.voice = voice;
                }

                window.speechSynthesis.speak(msg);
            }, 100);
        } else {
            console.warn('TTS not supported');
        }
    }
}
