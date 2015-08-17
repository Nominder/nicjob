var customWRTC = (function() {

  var peer = {};
  var id = '';

  var $ = function() {}

  $.prototype = {
    peer: {},
    id: '',
    call: {},
    discon: {},
    getId: function() {
      return this.id;
    },
    startCall: function(args) {
      // Initiate a call!
        var args = args || {},
        $ = this,
        id = args.id || '',
        selector = args.selector || '',
        mySelector = args.mySelector || '';
        navigator.getUserMedia({
          audio: true,
          video: true
        }, function(stream) {
          // Set your video displays
          document.querySelector(mySelector).setAttribute('src', URL.createObjectURL(stream));

          window.localStream = stream;
          var call = $.peer.call(id, window.localStream);
          $.step3(call, selector, $.discon);
        }, function() {});
    },
    endCall: function() {
      window.existingCall.close();
    },
    init: function(args) {
      // Get audio/video stream
      var $ = this,
        args = args || {},
        mySelector = args.mySelector || '',
        selector = args.selector || '',
        id = args.id || '',
        error = args.error || function() {},
        query = args.query || function() {},
        close = args.close || function() {};
      $.discon = args.discon || function() {};
      $.id = id;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      $.peer = new Peer($.id, {
        host: location.hostname,
        port: 80,
        path: '/WebRTC'
      });
      $.peer.on('open', function() {});
      // Receiving a call
      $.peer.on('call', function(call) {
        var ready = function() {
          navigator.getUserMedia({
            audio: true,
            video: true
          }, function(stream) {
            // Set your video displays
            document.querySelector(mySelector).setAttribute('src', URL.createObjectURL(stream));

            window.localStream = stream;
          }, function() {});
            call.answer(window.localStream);
            $.step3(call, selector, $.discon);
        }
        query(function(answer) {
          if (answer) {
            ready();
          } else {
            close();
          }
        });
      });

      $.peer.on('error', error);
    },
    step3: function(call, selector, discon) {
      // Hang up on an existing call if present
      if (window.existingCall) {
        window.existingCall.close();
      }

      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream) {
        document.querySelector(selector).setAttribute('src', URL.createObjectURL(stream));
      });

      // UI stuff
      window.existingCall = call;
      window.existingCall.on('close', discon);
    }
  }

  return $;
})();
