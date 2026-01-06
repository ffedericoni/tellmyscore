angular.module('ngScorekeeper.home', [
  'ui.router'
])
  .run(function () { console.log('ngScorekeeper.home RUN BLOCK'); }) // verification


  .config(function config($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      views: {
        "main": {
          controller: 'HomeCtrl',
          templateUrl: 'home/home.tpl.html'
        }
      },
      data: { pageTitle: 'Home' }
    });
  })

  .controller('HomeCtrl', function HomeController($scope, $window) {
    $scope.isonline = $window.navigator.onLine;
  });
