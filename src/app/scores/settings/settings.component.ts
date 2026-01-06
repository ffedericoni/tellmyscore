import { Component, inject, signal, effect, output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService, TtsSettings } from '../../shared/storage.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.component.html',
    styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 1040;
    }
    .modal {
      display: block;
      z-index: 1050;
    }
  `]
})
export class SettingsComponent {
    private storage = inject(StorageService);
    close = output<void>();

    private translate = inject(TranslateService);
    // Signals
    settings = this.storage.tts;

    allVoices = signal<SpeechSynthesisVoice[]>([]);
    filteredVoices = signal<SpeechSynthesisVoice[]>([]);

    constructor() {
        this.loadVoices();
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }

        // Effect to filtering voices when language changes
        effect(() => {
            const lang = this.settings().language;
            this.filterVoices(lang);
            // Ensure translation matches TTS language (using 2 letter code if possible, or full code)
            // The legacy app map 'en-US' to 'en' and 'it-IT' to 'it' via registerAvailableLanguageKeys
            // We'll simplisticly use 'en' or 'it' based on prefix
            const code = lang.substring(0, 2);
            this.translate.use(code);
        });
    }

    loadVoices() {
        if (!window.speechSynthesis) return;
        const voices = window.speechSynthesis.getVoices();
        this.allVoices.set(voices);
        this.filterVoices(this.settings().language);
    }

    filterVoices(lang: string) {
        const all = this.allVoices();
        if (!all.length) return;

        const prefix = lang.substring(0, 2);
        const filtered = all.filter(v => v.lang.startsWith(prefix));
        this.filteredVoices.set(filtered.length ? filtered : all);
    }

    updateSetting(key: keyof TtsSettings, value: any) {
        this.storage.tts.update(s => ({ ...s, [key]: value }));
    }

    // Helpers for template binding since signal is read-only for direct model binding if we don't update it
    // Actually dealing with object signal is tricky with ngModel.
    // We'll separate bound properties or use updating methods.
    // For simplicity, let's use getters/setters or just update directly on change.

    get rate() { return this.settings().rate; }
    set rate(val: number) { this.updateSetting('rate', val); }

    get pitch() { return this.settings().pitch; }
    set pitch(val: number) { this.updateSetting('pitch', val); }

    get language() { return this.settings().language; }
    set language(val: string) {
        // Reset voice if language changes
        this.storage.tts.update(s => ({ ...s, language: val, voiceURI: null }));
    }

    get voiceURI() { return this.settings().voiceURI; }
    set voiceURI(val: string | null) { this.updateSetting('voiceURI', val); }

    test() {
        if (!window.speechSynthesis) return;

        const s = this.settings();
        const text = s.language === 'it-IT'
            ? "Questa è una prova della voce selezionata."
            : "This is a test of the selected voice.";

        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = s.rate;
        msg.pitch = s.pitch;
        msg.lang = s.language;

        if (s.voiceURI) {
            const voice = this.allVoices().find(v => v.voiceURI === s.voiceURI);
            if (voice) msg.voice = voice;
        }

        window.speechSynthesis.speak(msg);
    }

    onClose() {
        this.close.emit();
    }
}
