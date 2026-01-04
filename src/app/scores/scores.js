angular.module('ngScorekeeper.scores', [
    'ui.router',
    'angularMoment',
    'ngStorage'
])

    .config(function config($stateProvider) {
        $stateProvider.state('scores', {
            url: '/scores',
            views: {
                "main": {
                    controller: 'ScoresCtrl',
                    templateUrl: 'scores/scores.tpl.html'
                }
            },
            data: { pageTitle: 'Scores' }
        });
    })

    .controller('ScoresCtrl', function ScoresCtrl($scope, $localStorage, $uibModal, $timeout) {
        $scope.default_title = 'Untitled Game';
        var browserLang = navigator.language || navigator.userLanguage;
        var defaultLang = (browserLang && browserLang.indexOf('it') === 0) ? 'it-IT' : 'en-US';

        $scope.$storage = $localStorage.$default(
            {
                games: [],
                players: [],
                title: $scope.default_title,
                rows: [],
                started: null,
                finished: null,
                tts: {
                    rate: 0.8,
                    pitch: 0,
                    language: defaultLang,
                    voiceURI: null
                }
            });
        $scope.totals = {};
        $scope.focus_input = false;
        $scope.winners = [];
        $scope.running = false;
        $scope.announcementText = '';

        $scope.open_settings = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'scores/settings.tpl.html',
                controller: function ($scope, $uibModalInstance, settings) {
                    $scope.settings = settings;
                    $scope.allVoices = [];
                    $scope.voices = [];

                    function loadVoices() {
                        $scope.allVoices = window.speechSynthesis.getVoices();
                        $scope.updateVoices();
                    }

                    $scope.updateVoices = function () {
                        // Filter voices by selected language if possible, but keep all as fallback
                        $scope.voices = $scope.allVoices.filter(function (v) {
                            return v.lang.indexOf($scope.settings.language.substring(0, 2)) === 0;
                        });
                        // If no voices match, fallback to all (or maybe default voice for that lang)
                        if ($scope.voices.length === 0) {
                            $scope.voices = $scope.allVoices;
                        }
                    };

                    loadVoices();
                    if (window.speechSynthesis.onvoiceschanged !== undefined) {
                        window.speechSynthesis.onvoiceschanged = loadVoices;
                    }

                    $scope.test = function () {
                        if ('speechSynthesis' in window) {
                            var text = $scope.settings.language === 'it-IT' ? "Questa è una prova della voce selezionata." : "This is a test of the selected voice.";
                            var msg = new SpeechSynthesisUtterance(text);
                            msg.rate = $scope.settings.rate;
                            msg.pitch = $scope.settings.pitch;
                            msg.lang = $scope.settings.language;
                            if ($scope.settings.voiceURI) {
                                msg.voice = $scope.allVoices.find(function (v) { return v.voiceURI === $scope.settings.voiceURI; });
                            }
                            window.speechSynthesis.speak(msg);
                        }
                    };

                    $scope.ok = function () {
                        $uibModalInstance.close();
                    };
                },
                resolve: {
                    settings: function () {
                        return $scope.$storage.tts;
                    }
                }
            });
        };

        $scope.start = function () {
            reset_totals();
            $scope.$storage.rows = [];
            $scope.$storage.finished = null;
            $scope.$storage.started = new Date();
            $scope.winners = [];
            $scope.new_row();
            $scope.running = true;
        };

        $scope.resume = function () {
            $scope.$storage.games.shift();
            $scope.$storage.finished = null;
            $scope.winners = [];
            $scope.running = true;
            $scope.new_row();
        };

        $scope.abort = function () {
            reset_totals();
            $scope.$storage.started = null;
            $scope.$storage.finished = null;
            $scope.$storage.rows = [];
            $scope.running = false;
            $scope.announcementText = '';
        };

        $scope.finish = function () {
            $scope.$storage.finished = new Date();
            $scope.running = false;
            var game =
            {
                title: angular.copy($scope.$storage.title),
                started: angular.copy($scope.$storage.started),
                finished: angular.copy($scope.$storage.finished),
                players: angular.copy($scope.$storage.players),
                totals: angular.copy($scope.totals)
            };
            $scope.$storage.games.unshift(game);

            while ($scope.$storage.rows.length > 0 && is_row_empty(angular.copy($scope.$storage.rows[$scope.$storage.rows.length - 1]))) {
                $scope.$storage.rows.pop();
            }

            render_result();
            $scope.announcementText = '';
        };

        $scope.new_row = function () {
            var row = {};
            for (var i in $scope.$storage.players) {
                row[$scope.$storage.players[i].id] = '';
            }

            $scope.$storage.rows.push(row);
            $scope.focus_input = true;
        };

        $scope.update_totals = function (player_id) {
            var player_total = 0,
                score = 0;
            for (var i in $scope.$storage.rows) {
                player_total += parse_score($scope.$storage.rows[i][player_id]);
            }
            $scope.totals[player_id] = player_total;
        };

        $scope.is_max = function (score, row) {
            //copy to get rid of $$hashKey
            var copy = angular.copy(row),
                i;
            if (is_row_empty(copy)) {
                return false;
            }
            for (i in copy) {
                if (parse_score(copy[i]) > parse_score(score)) {
                    return false;
                }
            }
            return true;
        };

        function is_row_empty(row) {
            for (var i in row) {
                if (parse_score(row[i]) !== 0) {
                    return false;
                }
            }
            return true;
        }

        function parse_score(score) {
            if (score === '') {
                return 0;
            }
            if (typeof score === 'string') {
                score = score.replace(/,/, '.');
            }
            if (!isNaN(score)) {
                return parseFloat(score, 10);
            }
            return 0;
        }

        $scope.announce_scores = function () {
            var sorted_players = [];
            for (var i in $scope.$storage.players) {
                sorted_players.push({
                    name: $scope.$storage.players[i].name,
                    score: $scope.totals[$scope.$storage.players[i].id]
                });
            }

            sorted_players.sort(function (a, b) {
                return b.score - a.score;
            });

            var lang = $scope.$storage.tts.language || 'en-US';
            var text = "";

            if (lang === 'it-IT') {
                text = "I punteggi attuali sono: ";
                for (var j = 0; j < sorted_players.length; j++) {
                    var unitIt = (sorted_players[j].score === 1) ? " punto. " : " punti. ";
                    text += sorted_players[j].name + " con " + sorted_players[j].score + unitIt;
                }
            } else {
                text = "The current scores are: ";
                for (var k = 0; k < sorted_players.length; k++) {
                    var unitEn = (sorted_players[k].score === 1) ? " point. " : " points. ";
                    text += sorted_players[k].name + " with " + sorted_players[k].score + unitEn;
                }
            }

            $scope.announcementText = text;

            if ('speechSynthesis' in window) {
                $timeout(function () {
                    var msg = new SpeechSynthesisUtterance(text);
                    msg.rate = $scope.$storage.tts.rate;
                    msg.pitch = $scope.$storage.tts.pitch;
                    msg.lang = lang;
                    if ($scope.$storage.tts.voiceURI) {
                        var voices = window.speechSynthesis.getVoices();
                        msg.voice = voices.find(function (v) { return v.voiceURI === $scope.$storage.tts.voiceURI; });
                    }
                    window.speechSynthesis.speak(msg);
                }, 100);
            } else {
                console.log("Text-to-speech not supported: " + text);
            }
        };

        function init() {
            if ($scope.$storage.rows.length > 0) {
                for (var i in $scope.$storage.players) {
                    $scope.update_totals($scope.$storage.players[i].id);
                }
            }
            if ($scope.$storage.started && !$scope.$storage.finished) {
                $scope.running = true;
            }
        }

        function reset_totals() {
            for (var i in $scope.$storage.players) {
                $scope.totals[$scope.$storage.players[i].id] = 0;
            }
        }

        function render_result() {
            var highscore = 0,
                winners = [];
            for (var i in $scope.$storage.players) {
                if ($scope.totals[$scope.$storage.players[i].id] > highscore) {
                    highscore = $scope.totals[$scope.$storage.players[i].id];
                    winners = [$scope.$storage.players[i].id];
                }
                else if ($scope.totals[$scope.$storage.players[i].id] === highscore) {
                    winners.push($scope.$storage.players[i].id);
                }
            }
            $scope.winners = winners;
        }

        init();
    })

    .directive('selectOnFocus', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('focus, click', function () {
                    this.select();
                });
            }
        };
    })
    .directive('focusMe', function ($timeout, $parse) {
        return {
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function (value) {
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
                element.bind('blur', function () {
                    if (model.assign) {
                        scope.$apply(model.assign(scope, false));
                    }
                });
            }
        };
    })
    .directive('contenteditable', ['$localStorage', function ($localStorage) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }

                ngModel.$render = function () {
                    if (element.text() !== ngModel.$viewValue) {
                        element.text(ngModel.$viewValue || scope.default_title);
                    }
                };

                element.on('blur', function () {
                    scope.$apply(read);
                });
                ngModel.$render();

                function read() {
                    var title = $.trim(element.text());
                    title = title.replace(/<br>/g, '');
                    if (title === '') {
                        title = scope.default_title;
                    }
                    ngModel.$setViewValue(title);
                    ngModel.$render();
                }
            }
        };
    }])
    .filter('playername', ['$localStorage', function ($localStorage) {
        return function (input) {
            for (var i in $localStorage.players) {
                if ($localStorage.players[i].id === input) {
                    return $localStorage.players[i].name;
                }
            }
            return input + ' not found';
        };
    }])
    .filter('playernames', ['$localStorage', function ($localStorage) {
        return function (input) {
            var names = [],
                i;
            for (i in $localStorage.players) {
                if (input.indexOf($localStorage.players[i].id) !== -1) {
                    names.push($localStorage.players[i].name);
                }
            }
            return names.join(', ');
        };
    }]);
