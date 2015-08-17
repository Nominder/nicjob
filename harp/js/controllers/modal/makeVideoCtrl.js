"use strict";
app.controller('makeVideo', function($scope, $rootScope, $http, dataSrv) {
	var record = document.querySelector('.makeVideo .startbutton');
	var stop = document.querySelector('.makeVideo .endbutton');
	var preview = document.querySelector('.makeVideo video');
	var processing = document.querySelector('.makeVideo .processing');
	var isFirefox = !!navigator.mozGetUserMedia;
	var recordAudio, recordVideo;
	var stream;
	var PostBlob = function(audioBlob, videoBlob, cb) {
		var formData = new FormData();
		formData.append('audio', audioBlob);
		formData.append('video', videoBlob);
		$scope.processing = "Сборка файла...";
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState == 4 && request.status == 200) {
				var data = request.response||request.responseText;
				cb(data);
			}
		};
		request.open('POST', '/api/0.1/media/compile');
		request.responseType = 'arraybuffer';
		request.send(formData);
	}
	$scope.isv = true;
	$scope.processing = false;
	$scope.timer = 120;
	$scope.timimg = "02:00";
	$scope.recTimer = function() {
		$scope.timer = $scope.timer-1;
		$scope.timimg = "0"+Math.floor($scope.timer/60)+":"+(($scope.timer-Math.floor($scope.timer/60)*60) < 10?'0':'')+($scope.timer-Math.floor($scope.timer/60)*60);
		if($scope.isv) {
			console.log("stop timer")
		} else if($scope.timer == 0) {
			$scope.endRecording();
		} else {
			setTimeout(function() {
				$scope.recTimer();
			}, 1000);
		}
	};
	$scope.startBackTimerRecording = function(t) {
		var f = function(i) {
			setTimeout(function(i) {
				$scope.timimg = "До начала записи осталось "+i+" сек.";
				if(i>0) {
					f(--i);
				} else {
					$scope.startRecording();
				}
			}, 1000, i);
		};
		f(t||5);
	}
	$scope.startRecording = function() {
		$scope.isv = false;
		$scope.recTimer();
		!stream && navigator.getUserMedia({
			audio: true,
			video: true
		}, function(strm) {
			stream = strm;
			onstream();
		}, function(error) {
			console.warn(JSON.stringify(error, null, '\t'));
		});
		stream && onstream();
		var onstream = function() {
			if(!preview) preview = document.querySelector('.makeVideo video');
			preview.src = window.URL.createObjectURL(stream);
			preview.play();
			preview.muted = true;
			recordAudio = RecordRTC(stream, {
				onAudioProcessStarted: function() {
					if (!isFirefox) {
						recordVideo.startRecording();
					}
				}
			});
			recordVideo = RecordRTC(stream, {
				type: 'video',
				video: {
					width: 320,
					height: 240
				}
			});
			recordAudio.startRecording();
		}
	}
	$scope.endRecording = function() {
		console.log('Getting Blobs...');
		$scope.isv = true;
		$scope.processing = 'Подготовка данных...';
		preview.src = '';
		preview.poster = '/img/block-loading.gif';
		if (!isFirefox) {
			recordAudio.stopRecording(function() {
				console.log('Got audio-blob. Getting video-blob...');
				recordVideo.stopRecording(function() {
					console.log('Uploading to server...');
					PostBlob(recordAudio.getBlob(), recordVideo.getBlob(), function(data) {
						var result = URL.createObjectURL(new Blob([data], {type:'video/webm'}));
						preview.src = result;
						$scope.videoUpload(result);
						preview.play();
						preview.muted = false;
						preview.muted = true;
						$scope.processing = false;
					});
				});
			});
		}
	}

	/* ===================== UPLOAD VIDEO ================================= */


	var videoData = {};
	$scope.openUploadVideo = function() {
		$scope.cstmModal = 'video';
		var q = function() {
			$http({
				method: 'GET',
				url: '/api/0.1/media/upload'
			})
			.success(function(data, status) {
				console.log(data);
				videoData.progressUri = data.result.progress;
				videoData.uploadUri = data.result.upload;
				window.videoProgressUri =data.result.progress;
				$scope.videoUploadFormView = true;
				$scope.videoUploadTitle = "";
				$scope.videoUploadDescription = "";
				$scope.videoUpload()
			})
			.error(function(data, status) {
				console.warn(data);
			});
		}
		q();
	}


	$scope.videoUpload = function(blobUri) {
		var uploadUri = videoData.uploadUri;
		var progressUri = videoData.progressUri;
		var refreshIntervalId;
		var refresh = 1000;
		console.log('Load data to server...');
		if(blobUri) {
			var code = "<script>var xhr = new XMLHttpRequest();\nxhr.open('GET','"+blobUri+"',true);\nxhr.responseType='blob';\nxhr.onload=function(e){if(this.status==200){var blob=this.response;\nvar formData=new FormData();\nformData.append('file',blob);\nvar xhr=new XMLHttpRequest();\nxhr.open('POST','"+uploadUri+"',true);\nxhr.onload=function(e){console.log('_ok_');\n};xhr.send(formData);\n}};\nxhr.send();\n</script>";
		} else {
			var code = "<script>function submitForm() {parent.runVideoUpload();document.querySelector('#form1').submit();}</script><form action='"+uploadUri+"' method='POST' enctype='multipart/form-data' id='form1'><input type='file' name='file' accept='video/*' onchange='submitForm()'></form>";
		}
		var pageUrl = URL.createObjectURL(new Blob([code], {type : 'text/html'}));
		var iframe = document.createElement('iframe');
		iframe.width = 300;
		iframe.height = 50;
		iframe.src = pageUrl;
		document.querySelector('.videoUpload .videoIframe').innerHTML = "";
		document.querySelector('.videoUpload .videoIframe').appendChild(iframe);
		var getPercent = function() {
			console.log(progressUri+"&format=json");
			$.ajax({
				type: 'GET',
				url: '/api/0.1/media/progress',
				data: {url: progressUri+"&format=json"},
				dataType: 'json',
				success: function(data) {
					console.log(data);
					if(data.Action=='done') {
						var code = data.Code;
						document.querySelector('.videoUpload .videoProgress').innerHTML = "Готово!";
						dataSrv.getVideo({code:code}, function(err, data) {
							console.log(data);
							$rootScope.modalData.to.push({
								title: $scope.videoUploadTitle,
								description: $scope.videoUploadDescription,
								video:code
							});
						});
						$rootScope.modal(false);
						console.log("DONE");
					} else {
						document.querySelector('.videoUpload .videoProgress progress').value = data.Percent;
						document.querySelector('.videoUpload .videoProgress progress span').innerHTML = data.Percent;
						refreshIntervalId = setTimeout(function(){getPercent()}, refresh);
					}
				}
			});
		}
		window.runVideoUpload = function() {
			document.querySelector('.videoUpload .videoProgress').innerHTML = "<progress max=\"100\" value=\"0\">Загружено на <span id=\"value\">0</span>%</progress>";
			$scope.videoUploadFormView = false;
			$scope.$apply();
			refreshIntervalId = setTimeout(function(){getPercent()}, refresh);
		}
	}
	$scope.videoUploadTo = null;
	$scope.videoUploadTitle = "";
	$scope.videoUploadDescription = "";


	$rootScope.$on('modal', function(target, data) {
		if(data.type == 'makeVideo') {
			$scope.openUploadVideo()
		}
	});
});






























if(false) {

	/* VIDEO IMAGE */
	/* / VIDEO IMAGE */


}



