"use strict";


app.controller('searchCompetitorsCtrl', function($scope, $rootScope, uiGmapGoogleMapApi, dataSrv) {
	$rootScope._data.header.active = 'competitors';
	var testPage = function() {
		if(window.scrollY+window.screen.height+100 > document.body.offsetHeight) {
			$rootScope.search(null, true);
		} else {
			setTimeout(function() {
				if($rootScope._data.header.active == 'competitors') {
					testPage();
				}
			}, 100);
		}
	}
	$rootScope.search();
	

	$scope.map = {
		center: {
			latitude: 55.755826,
			longitude: 37.6173
		},
		zoom: 10,
		bounds: {}
	};
	$scope.options = {
		scrollwheel: false
	};
	var createRandomMarker = function(i, bounds, idKey) {
		var lat_min = bounds.southwest.latitude,
			lat_range = bounds.northeast.latitude - lat_min,
			lng_min = bounds.southwest.longitude,
			lng_range = bounds.northeast.longitude - lng_min;
		if (idKey == null) {
			idKey = "id";
		}
		var latitude = lat_min + (Math.random() * lat_range);
		var longitude = lng_min + (Math.random() * lng_range);
		var ret = {
			latitude: latitude,
			longitude: longitude,
			title: 'm' + i
		};
		ret[idKey] = i;
		console.log({latitude: 55.87198059800693, longitude: 37.316329578239404, title: "m31", id: 31})
		return ret;
	};
	$scope.randomMarkers = [];
	// Get the bounds from the map once it's loaded
	$scope.$watch(function() {
		return $scope.map.bounds;
	}, function(nv, ov) {
			var markers = [];
			for (var _i in $rootScope._data.search.competitors.results) {
				var i = $rootScope._data.search.competitors.results[_i];
				markers.push({latitude: i.profile.contacts.locate.lt, longitude: i.profile.contacts.locate.lg, title: i.profile.info.lastname, id: _i})
			}
			$scope.randomMarkers = markers;
	}, true);


	$scope.clear = function() {
		$rootScope._data.search.competitors.fields = {type:'competitor',text:''};
	}

});