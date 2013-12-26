// C.REATE
function CreateCtrl ($scope, $location, offerService) {
  $scope.action = 'Add'
  $scope.save = function() {
    offerService.save($scope.offer, function() {
      $location.path('/')
    })
  }  
}

// CR.EAD
function ListCtrl ($scope, $http, $location, $window, offerService) {
  var index = -1;

  //for pagination and searching
  $scope.limit = 25
  $scope.offset = 0 //this is the same as: (current page - 1)
  $scope.total = -10
  $scope.pageCount = 0
  $scope.offers = offerService.query(); /** where does query operate ? */
  $scope.index = index; //currently selected element
  $scope.selectedId = -1; //actual id of selected offer

  $http.get('/api/offer/total').success(function(body) {
    $scope.total = body.total
    $scope.pageCount = Math.floor($scope.total / $scope.limit) 
    if ($scope.total % $scope.limit !== 0)
      $scope.pageCount += 1
  });

 /** todo, figure out how this function i works */
  $scope.select = function(i) {
    console.log(i);
    $scope.index = index;
    index = i;
    $scope.selected = this.offer;
    $scope.selectedId = this.offer.id;
    console.log($scope.selected);
  };

  // could be more ajaxy by rebuilding list client-side after delete ack 
  $scope.delete = function() {
    offerService.delete({id: $scope.selected.id});
    $window.location.href = '/'; 
  }

  $scope.loadPage = function (pg) {
    $scope.offset = pg - 1;
    $scope.offer = offerService.query({offset: $scope.offset, limit: $scope.limit});
  }
  loadGoogleMaps();
};

// CRU.PDATE
/** todo later */
function EditCtrl ($scope, $location, $routeParams, offerService) {
  var id = $routeParams.id;
  offerService.get({id: id}, function(resp) {
    $scope.offer = resp.content;
    console.log($scope.offer);
  });
 // $scope.offer = offerService.get({id: id});
  $scope.action = "Update";
  $scope.save = function() {
    offerService.update({id: id}, $scope.offer, function() {
      $location.path('/');
    })
  }
}

function DeleteCtrl ($scope, $window, offerService) {
  console.log("del:"+$scope.selected);
  if ($scope.selected) {
    $window.alert("got a selected"+$scope.selected.id)
    offerService.delete({id: $scope.selected.id});
  } else {
    $window.alert("selected not set");
  }
  $window.location.href = '/'; 
}

function MapCtrl ($scope) {
//myAppModule.controller('MapCtrl', ['$scope', function ($scope) {
    /*$scope.mapOptions = {
      center: new google.maps.LatLng(35.784, -78.670),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };*/
  } //]);
