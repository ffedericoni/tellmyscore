angular.module('ngScorekeeper', [
    'templates-app',
    'ngScorekeeper.home',
    'ngScorekeeper.players',
    'ngScorekeeper.scores',
    'ngScorekeeper.games',
    'ngScorekeeper.animations',
    'ui.bootstrap',
    'ui.router',
    'pascalprecht.translate'
])

    .config(function myAppConfig($stateProvider, $urlRouterProvider, $translateProvider) {
        $urlRouterProvider.otherwise('/home');

        var en_translations = {
            "HOME": {
                "TITLE": "Scorekeeper",
                "INTRO": "Many board and card games require someone to keep the score. But that someone can be your phone!",
                "ADD_PLAYERS": "Add Players",
                "TRACK_SCORES": "Track Scores",
                "FEATURE1_TITLE": "Good to Go!",
                "FEATURE1_DESC": "Just enter your players' names and start tracking!",
                "FEATURE2_TITLE": "Forgiving",
                "FEATURE2_DESC": "You can always go back and edit scores entered. scorekeeper is not here to interfere with your game.",
                "FEATURE3_TITLE": "Private",
                "FEATURE3_DESC": "No input is ever transmitted to a server, everything in stays your browser",
                "FEATURE4_TITLE": "Mobile Ready",
                "FEATURE4_DESC": "Works on smartphones and tablets as well as it does on desktop browsers.",
                "FEATURE5_TITLE": "Offline Capable",
                "FEATURE5_DESC": "Can be added to your home screen and will from then on work even when you have no connection",
                "FEATURE6_TITLE": "Free",
                "FEATURE6_DESC": "Free of ads, free of charge. And the code is available on Github, too"
            },
            "SCORES": {
                "NO_PLAYERS_PREFIX": "You have to ",
                "NO_PLAYERS_LINK": "add some players",
                "NO_PLAYERS_SUFFIX": " for this to work!",
                "STARTED": "started",
                "ROUND": "Round",
                "TOTALS": "Totals",
                "TIE": "It's a tie! Winners are",
                "WINS": "wins!",
                "ANNOUNCE": "Announce",
                "RESUME": "Resume",
                "START": "Start",
                "NEW": " New",
                "ABORT": "Abort",
                "FINISH": "Finish"
            },
            "GAMES": {
                "DELETE_CONFIRM_TITLE": "Delete Game from",
                "PLAYERS": "Players:",
                "DELETE": "Delete",
                "CANCEL": "Cancel",
                "TITLE": "Games",
                "UNTITLED": "Untitled Game"
            },
            "PLAYERS": {
                "TITLE": "Manage Players",
                "NO_PLAYERS": "No players defined",
                "PLACEHOLDER": "enter player's name",
                "ADD_TITLE": "Add Player",
                "REMOVE_TOOLTIP": "Remove"
            },
            "NAV": {
                "PLAYERS": "Players",
                "SCORES": "Scores",
                "GAMES": "Games"
            }
        };

        var it_translations = {
            "HOME": {
                "TITLE": "Scorekeeper",
                "INTRO": "Molti giochi da tavolo e carte richiedono qualcuno che tenga il punteggio. Ma quel qualcuno può essere il tuo telefono!",
                "ADD_PLAYERS": "Aggiungi Giocatori",
                "TRACK_SCORES": "Segna Punti",
                "FEATURE1_TITLE": "Pronto all'uso!",
                "FEATURE1_DESC": "Inserisci i nomi dei giocatori e inizia a segnare!",
                "FEATURE2_TITLE": "Indulgente",
                "FEATURE2_DESC": "Puoi sempre tornare indietro e modificare i punteggi inseriti. scorekeeper non è qui per interferire con il tuo gioco.",
                "FEATURE3_TITLE": "Privato",
                "FEATURE3_DESC": "Nessun dato viene mai trasmesso a un server, tutto rimane nel tuo browser",
                "FEATURE4_TITLE": "Mobile Ready",
                "FEATURE4_DESC": "Funziona su smartphone e tablet bene come su desktop.",
                "FEATURE5_TITLE": "Funziona Offline",
                "FEATURE5_DESC": "Può essere aggiunto alla home screen e funzionerà anche senza connessione",
                "FEATURE6_TITLE": "Gratis",
                "FEATURE6_DESC": "Niente pubblicità, niente costi. E il codice è disponibile su Github."
            },
            "SCORES": {
                "NO_PLAYERS_PREFIX": "Devi ",
                "NO_PLAYERS_LINK": "aggiungere dei giocatori",
                "NO_PLAYERS_SUFFIX": " affinché funzioni!",
                "STARTED": "iniziato",
                "ROUND": "Round",
                "TOTALS": "Totali",
                "TIE": "Pareggio! I vincitori sono",
                "WINS": "vince!",
                "ANNOUNCE": "Annuncia",
                "RESUME": "Riprendi",
                "START": "Inizia",
                "NEW": " Nuovo",
                "ABORT": "Annulla",
                "FINISH": "Finisci"
            },
            "GAMES": {
                "DELETE_CONFIRM_TITLE": "Elimina partita del",
                "PLAYERS": "Giocatori:",
                "DELETE": "Elimina",
                "CANCEL": "Annulla",
                "TITLE": "Partite",
                "UNTITLED": "Partita senza titolo"
            },
            "PLAYERS": {
                "TITLE": "Gestisci Giocatori",
                "NO_PLAYERS": "Nessun giocatore definito",
                "PLACEHOLDER": "inserisci nome giocatore",
                "ADD_TITLE": "Aggiungi Giocatore",
                "REMOVE_TOOLTIP": "Rimuovi"
            },
            "NAV": {
                "PLAYERS": "Giocatori",
                "SCORES": "Punteggi",
                "GAMES": "Partite"
            }
        };

        $translateProvider.translations('en', en_translations);
        $translateProvider.translations('it', it_translations);

        $translateProvider.registerAvailableLanguageKeys(['en', 'it'], {
            'en_*': 'en',
            'it_*': 'it'
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.fallbackLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
    })

    .run(function run($rootScope, $translate, amMoment) {
        $rootScope.$on('$translateChangeSuccess', function () {
            var lang = $translate.use();
            if (lang) {
                amMoment.changeLocale(lang);
            }
        });
    })

    .controller('AppCtrl', function AppCtrl($scope, $location, $transitions) {
        $transitions.onSuccess({}, function ($transition) {
            if ($transition.to().name !== 'home') {
                $scope.pageTitle = $transition.to().data.pageTitle + ' | scorekeeper';
            } else {
                $scope.pageTitle = 'scorekeeper';
            }
        });
    });
