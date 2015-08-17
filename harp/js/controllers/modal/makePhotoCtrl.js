"use strict";
app.controller('makePhoto', function($scope, $rootScope, $http, dataSrv) {
	var image = null, dui = null, file = null;
	$scope.selectImage = false;
	var streaming = false,
	getMedia = false,
	video = document.querySelector('.makePhoto video'),
	canvas = document.querySelector('.makePhoto canvas'),
	photo = document.querySelector('.makePhoto img'),
	startbutton = document.querySelector('.makePhoto .startbutton'),
	width = 300,
	height = 300;
	$(function(){
		video = document.querySelector('.makePhoto video'),
		canvas = document.querySelector('.makePhoto canvas'),
		photo = document.querySelector('.makePhoto img'),
		video.addEventListener('canplay', function(ev) {
			if (!streaming) {
				height = video.videoHeight / (video.videoWidth/width);
				video.setAttribute('width', width);
				video.setAttribute('height', height);
				canvas.setAttribute('width', width);
				canvas.setAttribute('height', height);
				streaming = true;
			}
		}, false);
	})
	$scope.imageChange = function(event) {
		$scope.selectImage = true;
		$scope.$apply();
		file = event.target.files[0];
		var reader = new FileReader();
		reader.onload = function(event) {
			var dataUri = reader.result;
			jQuery(".preview img").attr("src",dataUri);
			image = jQuery(".preview img").imgAreaSelect({aspectRatio: '3:4', handles: true, instance: true, onSelectEnd: function() {
				$scope.cut();
			}});
			console.log(dataUri);
		};
		reader.readAsDataURL(file);
		return;
	}
	$scope.openCam = function() {
		video.style.display = 'block';
		photo.style.display = 'none';
		if(getMedia == true) return false;
		$scope.isv = true;
		getMedia = true;
		navigator.getMedia(
			{ 
				video: true, 
				audio: false 
			},
			function(stream) {
				if (navigator.mozGetUserMedia) { 
					video.mozSrcObject = stream;
				} else {
					var vendorURL = window.URL || window.webkitURL;
					video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
				}
				video.play();
			},
			function(err) {
				console.log("An error occured! " + err);
			}
		);
	}
	$scope.getPhoto = function() {
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		var data = canvas.toDataURL('image/png');
		video.style.display = 'none';
		photo.style.display = 'block';
		$scope.isv = false;
		dui = data;
		photo.setAttribute('src', data);
	}
	$scope.cut = function() {
			var temp_canvas = document.createElement('canvas');
			var temp_ctx = temp_canvas.getContext('2d');
			var s = image.getSelection();
			console.log(s);
			if(s.width == 0) return dui = null;
			var lw = document.querySelector(".preview img").naturalWidth;
			var lh = document.querySelector(".preview img").naturalHeight;
			var mw = document.querySelector(".preview img").width;
			var mh = document.querySelector(".preview img").height;
			var pw = lw/mw;
			var ph = lh/mh;
			s.w = s.width*pw;
			s.h = s.height*ph;
			s.x = s.x1*ph;
			s.y = s.y1*ph;
			temp_canvas.width = s.w;
			temp_canvas.height = s.h;
			temp_ctx.drawImage(document.querySelector(".preview img"), s.x, s.y, s.w, s.h, 0, 0, s.w, s.h);
			var vData = temp_canvas.toDataURL();
			dui = vData;
			console.log(vData);
	}
	$scope.uploadFile = function() {
		var formData=new FormData();
		console.log(file);
		formData.append("file",dui? dataURItoBlob(dui) : file);
		$http({
			method: 'POST',
			url: '/api/0.1/images/create',
			headers: { 'Content-Type': undefined},
			data: formData,
			transformRequest: function(data, headersGetterFunction) {
				return data;
			}
		})
		.success(function(data, status) {
			console.log(data);
			$rootScope.modalData.to.push({title:"", description:"", image:data.result});
			$scope.refresh();
			$rootScope.modal(false);
		})
		.error(function(data, status) {
			console.warn(data);
		});
	};
	$scope.refresh = function() {
		$scope.isv = true;
		video.style.display = 'block';
		photo.style.display = 'none';
		image = null;
		dui = null;
		file = null;
		jQuery(".preview img").attr("src","");
		$scope.selectImage = false;
	}

	$rootScope.$on('modal', function(target, data) {
		if(data.type == 'makePhoto') {
			$scope.openCam();
		}
	})
});



