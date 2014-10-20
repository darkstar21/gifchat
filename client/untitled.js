'use strict';



angular.module('itineraryProjApp')
  .controller('PlacesCtrl', function ($scope, Auth, $http, $log, $timeout) {
    $scope.itinerary = {};
    $scope.itinerary.username = Auth.getCurrentUser().name;
    $scope.itinerary.locations = {};
    $scope.fountain = "hello"
    // $scope.itinerary.location = [];
    // $scope.itinerary.address=[];
    // $scope.itinerary.name = [];
    // $scope.itinerary.dateArray = [];
    // $scope.date;
    $scope.dateEntered=false;
    $scope.submitted = false;
    $scope.myData = [
    {name: 'AngularJS', count: 300},
    {name: 'D3.JS', count: 150},
    {name: 'jQuery', count: 400},
    {name: 'Backbone.js', count: 300},
    {name: 'Ember.js', count: 100}
    ];

    $scope.doSearch = function(){
        if($scope.location === ''){
            alert('Directive did not update the location property in parent controller.');
        } else {
            alert('Yay. Location: '+JSON.stringify($scope.address) + $scope.location);
        }
    }
    $scope.submit = function(){
      $http.post('/api/things', $scope.itinerary).success(function(data, status, headers, config){
        $scope.submitted = true;
        console.log ('Thank you your url has been submitted!!!!!!111!11!1!')
      }).error(function(data, status, headers, config){
        console.error('there was an error yo');
      });
    }

    $scope.retrieve = function(){
      $http.get('/api/things/'+$scope.itinerary.username).success(function(data, status, headers, config){
        $scope.itinerary = data;
        console.log ('You got it back!!!')
      }).error(function(data, status, headers, config){
        console.error('there was an error yo');
      });
    }

    $scope.$watch("date", function(date) {
      if(date!==undefined){
        $scope.dateEntered=true;
      }
    });

    /////MAP SHIT
    $scope.map = {center: {latitude: 0, longitude: 0 }, zoom: 1 };
    $scope.options = {scrollwheel: false,
      styles: [{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]},{"stylers":[{"saturation":-17},{"gamma":0.36}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}]
    }
    $scope.coordsUpdates = 0;
    $scope.dynamicMoveCtr = 0;
    // $scope.marker = {
    //   id: 0,
    //   coords: {
    //     latitude: 40.1451,
    //     longitude: -99.6680
    //   },
    // };
    $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
      if (_.isEqual(newVal, oldVal))
        return;
      $scope.coordsUpdates++;
    });
    
    ////////////
  })
  .directive('googlePlaces', function(){
      return {
          restrict:'E',
          replace:true,
          transclude:true,
          // scope: {location:'='},
          template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
          link: function($scope, elm, attrs){
              var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
              google.maps.event.addListener(autocomplete, 'place_changed', function() {
                  var place = autocomplete.getPlace();
                  $scope.itinerary.locations[place.name]= {} 
                  var newObj = $scope.itinerary.locations[place.name]
                  newObj.address = autocomplete.getPlace().formatted_address
                  newObj.name = autocomplete.getPlace().name
                  newObj.date = $scope.date
                  $scope.dateEntered = false;
                  newObj.coordinates = {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()};
                  // $scope.$apply();
              });
          }
      }
  })
  .directive( 'crD3Bars', [
  function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function (scope, element) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 480 - margin.left - margin.right,
          height = 360 - margin.top - margin.bottom;
        var svg = d3.select(element[0])
          .append("svg")
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
        var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
        var y = d3.scale.linear().range([height, 0]);
 
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
 
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);
 
        //Render graph based on 'data'
        scope.render = function(data) {
          //Set our scale's domains
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.count; })]);
          
          //Redraw the axes
          svg.selectAll('g.axis').remove();
          //X axis
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
              
          //Y axis
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Count");
              
          var bars = svg.selectAll(".bar").data(data);
          bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.name); })
            .attr("width", x.rangeBand());
 
          //Animate bars
          bars
              .transition(1000)
              .duration(1000)
              .attr('height', function(d) { return height - y(d.count); })
              .attr("y", function(d) { return y(d.count); })
        };
 
         //Watch 'data' and run scope.render(newVal) whenever it changes
         //Use true for 'objectEquality' property so comparisons are done on equality and not reference
          scope.$watch('data', function(){
              scope.render(scope.data);
          }, true);  
        }
    };
  }
]);