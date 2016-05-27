var BCLS = (function(window, document) {
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
