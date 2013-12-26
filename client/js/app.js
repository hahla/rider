

var offerApp = angular.module('offerApp', ['ngResource', 'ui.map'])

offerApp.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {controller: ListCtrl, templateUrl: '/partials/list.html'}) 
    .when('/edit/:id', {controller: EditCtrl, templateUrl: '/partials/details.html'})
    .when('/new', {controller: CreateCtrl, templateUrl: '/partials/details.html'})
    .when('/del/:id', {controller: DeleteCtrl, templateUrl: '/partials/list.html'})
    .otherwise({redirectTo: '/'})
    $locationProvider.html5Mode(true)
});



offerApp.factory('offerService', function($resource) {
  return $resource('/api/offer/:id', 
                  {id: '@id'}, 
                  {update: {method: 'PUT'}})
});

//http://stackoverflow.com/questions/11873570/angularjs-for-loop-with-numbers-ranges
offerApp.filter('range', function() {
  return function(input) {
    var lowBound, highBound;
    switch (input.length) {
      case 1:
        lowBound = 0;
        highBound = parseInt(input[0]) - 1;
        break;
      case 2:
        lowBound = parseInt(input[0]);
        highBound = parseInt(input[1]);
        break;
      default:
        return input;
    }
    var result = [];
    for (var i = lowBound; i <= highBound; i++)
        result.push(i);
    return result;
  };
});

offerApp.directive('offerlist', function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/offerlist.html'
  }
});

offerApp.directive('formfield', function() {
  return {
    restrict: 'E', //could be E, A, C (class), M (comment)
    scope: {
      prop: '@',
      data: '=ngModel'
    },
    templateUrl: '/partials/formfield.html'
  }
});