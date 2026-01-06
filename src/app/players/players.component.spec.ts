import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayersComponent } from './players.component';
import { StorageService } from '../shared/storage.service';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('PlayersComponent', () => {
    let component: PlayersComponent;
    let fixture: ComponentFixture<PlayersComponent>;
    let storage: StorageService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlayersComponent, TranslateModule.forRoot()],
            providers: [
                StorageService, // Real service or mock? Real is fine for basic test as it uses localStorage
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PlayersComponent);
        component = fixture.componentInstance;
        storage = TestBed.inject(StorageService);

        // Reset storage
        storage.players.set([]);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add a player', () => {
        component.newPlayerName = 'Test Player';
        component.addPlayer();

        expect(storage.players().length).toBe(1);
        expect(storage.players()[0].name).toBe('Test Player');
    });

    it('should remove a player', () => {
        component.newPlayerName = 'Player 1';
        component.addPlayer();
        const p1 = storage.players()[0];

        component.removePlayer(p1);
        expect(storage.players().length).toBe(0);
    });
});
