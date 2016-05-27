  videojs('myPlayerID').ready(function(){
    var myPlayer = this,
      theDiv = document.getElementById('insertionPoint');
    myPlayer.on('loadeddata',function(){
      theDiv.innerHTML += 'loadeddata dispatched<br />';
    });
    myPlayer.on('loadedmetadata',function(){
      theDiv.innerHTML += 'loadedmetadata dispatched<br />';
    });
    myPlayer.on('loadstart',function(){
      theDiv.innerHTML += 'loadstart dispatched<br />';
    });

    //myPlayer.controls(false);


/* ================================================================= */
/*         functions tools                                           */
/* ================================================================= */

    var createPopoverContent = function(contentId, inputAttributes, upperGlyph, bottomGlyph, buttonAttributes){
      var popOverContent = document.createElement("div");
      popOverContent.id = contentId;
      popOverContent.style = "width: 240px;";
      var popOverInput = document.createElement("input");
      for (var attr in inputAttributes){
        popOverInput.setAttribute(attr, inputAttributes[attr]);
      }

      popOverInput.setAttribute("style", "display:inline-block; width: 150px; margin-left: 5px; margin-right: 5px;");

      var normButton = document.createElement("button");
      for(var attr in buttonAttributes){
        if(attr == "children"){
          buttonAttributes[attr].forEach(function(child){
            normButton.appendChild(child);
          });
        } else {
          normButton.setAttribute(attr, buttonAttributes[attr]);
        }
      }

      normButton.style = "display:inline-block; margin-left: 5px;";

      var glyphUp = document.createElement("span");
      glyphUp.className = "glyphicon glyphicon-" + upperGlyph;

      var glyphDown = document.createElement("span");
      glyphDown.className = "glyphicon glyphicon-" + bottomGlyph;

      popOverContent.appendChild(glyphUp);
      popOverContent.appendChild(popOverInput);
      popOverContent.appendChild(glyphDown);
      popOverContent.appendChild(normButton);

      return popOverContent;
    }

    var createGlyph = function(glyphName){
      var glyph = document.createElement("span");
      glyph.className = "glyphicon glyphicon-" + glyphName;
      return glyph;
    }

    var secToTime = function(milisec){
      //var d = moment.duration(milisec, 'milliseconds');
      var d = moment.duration(milisec, 'seconds');
      var hours = Math.floor(d.asHours());
      var mins = Math.floor(d.asMinutes()) - hours * 60;
      var seconds = Math.floor(d.asSeconds()) - mins * 60;
      //console.log("hours:" + hours + " mins:" + mins + " sec:" + seconds);
      return hours + ":" + mins + ":" + seconds;
    }

/* ================================================================= */
/*         end function tools                                        */
/* ================================================================= */

    var volumeAttributes = {
      id: "volumeSlider",
      type: "range",
      min: "0",
      max: "10",
      value: "10",
      class: "volume"
    }

    var vNormButtonAttributes = {
      id:"muteButton",
      type: "button",
      class: "btn btn-info-outline",
      children: [createGlyph("volume-off")]
    }
    var volumeContent = createPopoverContent("volume-content", volumeAttributes, "volume-down", "volume-up", vNormButtonAttributes);
    var volumeSlider = volumeContent.childNodes[1];
    var muteButton = volumeContent.childNodes[3]

    var speedAttributes = {
      id: "playbackRateSlider",
      type: "range",
      min: "1",
      max: "40",
      value: "10"
    }

    var sNormButtonAttributes = {
      id:"normalSpeedButton",
      type: "button",
      class: "btn btn-info-outline",
      children: [createGlyph("play-circle")]
    }

    var speedContent = createPopoverContent("speed-content", speedAttributes, "backward", "forward", sNormButtonAttributes);
    var playbackRateSlider = speedContent.childNodes[1];
    var normalSpeedButton = speedContent.childNodes[3];

    var panelContent = document.createElement("div");
    panelContent.id = "panel-content";

    panelContent.appendChild(speedContent);
    panelContent.appendChild(volumeContent);

/*
    $('#volumeToggle').popover({
      html:true,
      content: volumeContent
    });

    $('#speedToggle').popover({
      html:true,
      content: speedContent
    });
*/

    $('#configPanel').popover({
      html:true,
      content: panelContent
    });

    var playButton = document.getElementById("playButton");
    var fullScreenButton = document.getElementById("fullScreenButton");
    var loopButton = document.getElementById("loopButton");
    var getTextTrackButton = document.getElementById("getTextTrackButton");
    var timeBar = document.getElementById("time-bar");
    var scrubbing = false;
    var time = document.getElementById("time");
    var timeRemain = document.getElementById("time-remain");
    var videoPlayer = document.getElementById("myPlayerID");
    var playlistLoopButton = document.getElementById("playlistLoopButton");
    var isPlaylistLooping = false;
    var controlBar = document.getElementById("control-bar");

    var timer;

    //myPlayer.playlist.autoadvance(0.5);
    myPlayer.addChild(controlBar);
    var oldControlBar = myPlayer.getChild("controlBar");


    myPlayer.removeChild(myPlayer.getChild("controlBar"));

    var newControlBar = document.getElementById("control-bar");

    myPlayer.el().appendChild(newControlBar);




    time.innerHTML = "0:0:0" + "/" + secToTime(myPlayer.duration());

    timeBar.addEventListener("mousedown", function () {
        scrubbing = true;
      });

    timeBar.addEventListener("change", function () {
      scrubbing = false;
      var curTime = this.value/1000 * myPlayer.duration();
      myPlayer.currentTime(curTime);
    });

    playButton.addEventListener("click", function(){
      if(myPlayer.paused()){
        myPlayer.play();

        timer = setInterval(function(){
            if(!scrubbing){
              timeBar.value = myPlayer.currentTime() / myPlayer.duration() * 1000;
              time.innerHTML = secToTime(myPlayer.currentTime()) + "/" + secToTime(myPlayer.duration());
              timeRemain.innerHTML = secToTime(myPlayer.remainingTime());
              if(myPlayer.ended()){
                if(isPlaylistLooping && myPlayer.playlist.currentItem() == myPlayer.playlist().length-1){
                  myPlayer.playlist.currentItem(0);
                }
              }
            }
          }, 10);

        var glyphPause = createGlyph("pause");
        this.innerHTML = "";
        this.appendChild(glyphPause);
      } else {
        myPlayer.pause();

        clearInterval(timer);

        var glyphPlay = createGlyph("play");
        this.innerHTML = "";
        this.appendChild(glyphPlay);
      }
    });

    muteButton.addEventListener("click", function(){
      if(myPlayer.muted()){
        myPlayer.muted(false);
        volumeSlider.value = myPlayer.volume()*10;
        this.innerHTML = "";
        var glyphMute = createGlyph("volume-off");
        this.appendChild(glyphMute);
      } else {
        myPlayer.muted(true);
        volumeSlider.value = 0;
        this.innerHTML = "";
        var glyphUnMute = createGlyph("volume-up");
        this.appendChild(glyphUnMute);
      }
    });

    normalSpeedButton.addEventListener("click", function(){
      myPlayer.playbackRate(1);
      playbackRateSlider.value = 10;
    });

    getTextTrackButton.addEventListener("click", function(){
      console.log(myPlayer.textTracks());
    });

    loopButton.addEventListener("click", function(){
      if(myPlayer.loop()){
        myPlayer.loop(false);
        this.className = "btn btn-info-outline";
      } else {
        myPlayer.loop(true);
        this.className = "btn btn-info";
      }
    });

    playlistLoopButton.addEventListener("click", function(){
      if(isPlaylistLooping){
        isPlaylistLooping = false;
        this.className = "btn btn-info-outline";
      } else {
        isPlaylistLooping = true;
        this.className = "btn btn-info";
      }
    });

    fullScreenButton.addEventListener("click", function(){
          if(myPlayer.isFullscreen()){
            myPlayer.exitFullscreen();
          } else {
            myPlayer.requestFullscreen();
          }
      });
    playbackRateSlider.addEventListener("change", function(){
      myPlayer.playbackRate(this.value / 10);
    });

    volumeSlider.addEventListener("change", function(){
      myPlayer.volume(this.value / 10);
    });
    });

/*
  var BCLS = (function(window, document) {
    console.log("BCLS");
    var apiBaseURL = 'https://edge.api.brightcove.com/playback/v1',
      // element references
      account_id = document.getElementById('account_id'),
      policy_key = document.getElementById('policy_key'),
      video_id = document.getElementById('video_id'),
      playlist_id = document.getElementById('playlist_id'),
      videoButton = document.getElementById('videoButton'),
      playlistButton = document.getElementById('playlistButton'),
      apiRequest = document.getElementById('apiRequest'),
      generatedContent = document.getElementById('generatedContent'),
      responseData = document.getElementById('responseData'),
      // functions
      makeVideoDisplay,
      makePlaylistDisplay,
      getMediaData;

      var video = document.getElementById("myPlayerID");
      video.setAttribute("data-video-id", video_id.value);
      video.setAttribute("data-account", account_id.value);
      //video.setAttribute("data-playlist-id", playlist_id.value);
      videoPlayer();

    makeVideoDisplay = function(videoData) {
      var videoEl,
        imgEl,
        titleEl,
        descriptionEl,
        dataEl;
      // clear the display
      generatedContent.innerHTML = "";
      // generate an HTML display of the video item
      videoEl = document.createElement('div');
      imgEl = document.createElement('img');
      titleEl = document.createElement('h2');
      descriptionEl = document.createElement('p');
      videoEl.setAttribute('class', 'video-item');
      videoEl.appendChild(imgEl);
      videoEl.appendChild(titleEl);
      videoEl.appendChild(descriptionEl);
      if (videoData.thumbnail_sources) {
        imgEl.setAttribute("src", videoData.thumbnail_sources[0].src);
      } else {
        imgEl.setAttribute("src", videoData.thumbnail);
      }
      titleEl.appendChild(document.createTextNode(videoData.name));
      descriptionEl.appendChild(document.createTextNode(videoData.description));
      generatedContent.appendChild(videoEl);
      // display the video data
      responseData.innerHTML = JSON.stringify(videoData, null, '  ');

    };

    makePlaylistDisplay = function(playlistData) {
      var videoEl,
        imgEl,
        titleEl,
        descriptionEl,
        dataEl,
        i,
        iMax;
      // clear the display
      generatedContent.innerHTML = "";
      // generate an HTML display of the video items
      iMax = playlistData.videos.length;
      for (i = 0; i < iMax; i++) {
        videoData = playlistData.videos[i];
        videoEl = document.createElement('div');
        imgEl = document.createElement('img');
        titleEl = document.createElement('h2');
        descriptionEl = document.createElement('p');
        videoEl.setAttribute('class', 'video-item');
        videoEl.appendChild(imgEl);
        videoEl.appendChild(titleEl);
        videoEl.appendChild(descriptionEl);
        if (videoData.thumbnail_sources) {
          imgEl.setAttribute("src", videoData.thumbnail_sources[0].src);
        } else {
          imgEl.setAttribute("src", videoData.thumbnail);
        }
        titleEl.appendChild(document.createTextNode(videoData.name));
        descriptionEl.appendChild(document.createTextNode(videoData.description));
        generatedContent.appendChild(videoEl);
      }
      // display the video data
      responseData.innerHTML = JSON.stringify(playlistData, null, '  ');

    };

    getMediaData = function(mediaType, requestURL) {
      var httpRequest = new XMLHttpRequest(),
        responseData,
        parsedData,
        // response handler
        getResponse = function() {
          try {
            if (httpRequest.readyState === 4) {
              if (httpRequest.status === 200) {
                responseData = httpRequest.responseText;
                parsedData = JSON.parse(responseData);
                switch (mediaType) {
                  case 'video':
                    makeVideoDisplay(parsedData);
                    break;
                  case 'playlist':
                    makePlaylistDisplay(parsedData);
                    break;
                }
              } else {
                alert('There was a problem with the request. Request returned ' + httpRequest.status);
              }
            }
          } catch (e) {
            alert('Caught Exception: ' + e);
          }
        };
      // set response handler
      httpRequest.onreadystatechange = getResponse;
      // open the request
      httpRequest.open('GET', requestURL);
      // set headers
      httpRequest.setRequestHeader('Accept', 'application/json;pk=' + policy_key.value);
      // open and send request
      httpRequest.send();
    };

    // event listeners
    if(videoButton){
      videoButton.addEventListener('click', function() {
        var mediaType = 'video',
          requestURL = apiBaseURL + '/accounts/' + account_id.value + '/videos/' + video_id.value;
        apiRequest.innerHTML = requestURL;
        getMediaData(mediaType, requestURL);
      });
    }
    if(playlistButton){
      playlistButton.addEventListener('click', function() {
        var mediaType = 'playlist',
          requestURL = apiBaseURL + '/accounts/' + account_id.value + '/playlists/' + playlist_id.value;
        apiRequest.innerHTML = requestURL;
        getMediaData(mediaType, requestURL);
      });
    }

  })(window, document);
*/
