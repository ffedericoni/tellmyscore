import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoresComponent } from './scores.component';
import { StorageService } from '../shared/storage.service';
import { provideRouter } from '@angular/router';

describe('ScoresComponent', () => {
    let component: ScoresComponent;
    let fixture: ComponentFixture<ScoresComponent>;
    let storage: StorageService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ScoresComponent],
            providers: [StorageService, provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(ScoresComponent);
        component = fixture.componentInstance;
        storage = TestBed.inject(StorageService);

        // Seed some data
        storage.players.set([{ id: 'p1', name: 'Alice' }, { id: 'p2', name: 'Bob' }]);
        storage.started.set(new Date().toISOString());

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create new row on start', () => {
        component.start();
        expect(storage.rows().length).toBe(1);
        const row = storage.rows()[0];
        expect(row['p1']).toBe('');
        expect(row['p2']).toBe('');
    });

    it('should calculate totals', () => {
        component.start();
        const row = storage.rows()[0];
        row['p1'] = '10';
        row['p2'] = '5';

        component.updateTotals({ id: 'p1', name: 'Alice' });

        expect(component.totals()['p1']).toBe(10);
        expect(component.totals()['p2']).toBe(5);
    });
});
