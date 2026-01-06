import { Injectable, signal, computed, effect, WritableSignal } from '@angular/core';

export interface Player {
    id: string;
    name: string;
}

export interface Game {
    title: string;
    started: string | null;
    finished: string | null;
    players: Player[];
    totals: { [key: string]: number };
}

export interface TtsSettings {
    rate: number;
    pitch: number;
    language: string;
    voiceURI: string | null;
}

interface AppState {
    players: Player[];
    games: Game[];
    title: string;
    rows: any[];
    started: string | null;
    finished: string | null;
    tts: TtsSettings;
}

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private storageKey = 'ngStorage-';

    // Signals for state
    public players: WritableSignal<Player[]> = signal([]);
    public games: WritableSignal<Game[]> = signal([]);
    public title: WritableSignal<string> = signal('Untitled Game');
    public rows: WritableSignal<any[]> = signal([]);
    public started: WritableSignal<string | null> = signal(null);
    public finished: WritableSignal<string | null> = signal(null);
    public tts: WritableSignal<TtsSettings> = signal({
        rate: 0.8,
        pitch: 0,
        language: 'en-US',
        voiceURI: null
    });

    constructor() {
        this.loadState();

        // Auto-save effects
        effect(() => this.save('players', this.players()));
        effect(() => this.save('games', this.games()));
        effect(() => this.save('title', this.title()));
        effect(() => this.save('rows', this.rows()));
        effect(() => this.save('started', this.started()));
        effect(() => this.save('finished', this.finished()));
        effect(() => this.save('tts', this.tts()));
    }

    private loadState() {
        this.players.set(this.get('players') || []);
        this.games.set(this.get('games') || []);
        this.title.set(this.get('title') || 'Untitled Game');
        this.rows.set(this.get('rows') || []);
        this.started.set(this.get('started') || null);
        this.finished.set(this.get('finished') || null);

        const savedTts = this.get<TtsSettings>('tts');
        if (savedTts) {
            this.tts.set(savedTts);
        }
    }

    get<T>(key: string): T | null {
        // Legacy mapping: ngStorage saved in root with specific keys usually, 
        // or under one big object? 
        // Legacy app used: $scope.$storage = $localStorage.$default({...})
        // This usually implies keys like 'ngStorage-players', 'ngStorage-games' if using default prefix 'ngStorage-'.
        const item = localStorage.getItem(this.storageKey + key);
        return item ? JSON.parse(item) : null;
    }

    private save(key: string, value: any): void {
        localStorage.setItem(this.storageKey + key, JSON.stringify(value));
    }
}
