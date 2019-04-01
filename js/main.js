let htmlList = '';
const IMAGE_URL = 'https://in.bmscdn.com/events/moviecard/';
// API Call is not working because of cors origin error, so i took the data local
$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: '../api/data.json',
    dataType: 'JSON',
    success: function(data) {
      onDataLoaded(data);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      console.log('Error: ' + thrownError);
    }
  });

  var tag = document.createElement('script');

  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

function onDataLoaded(data) {
  const movieData = data[1];
  let index = 1;
  for (const key of Object.keys(movieData)) {
    renderMoviesList(
      movieData[key].EventTitle,
      movieData[key].EventCode,
      movieData[key].TrailerURL,
      movieData[key].EventGroup,
      movieData[key].EventLanguage,
      movieData[key].EventGenre,
      index
    );
    index++;
  }
  $('#movieList').empty();
  $('#movieList').append(htmlList);
  $('.movie-block.my-2').click(function(e) {
    playTrailer(e);
  });
}

function renderMoviesList(
  title,
  imageCode,
  trailerUrl,
  id,
  lannguage,
  genre,
  index
) {
  console.log(title);
  const imgSrc = IMAGE_URL + imageCode + '.jpg';

  if (index === 1) {
    htmlList += `<div class="row">
    `;
  }

  htmlList += `<div class="col-lg-2 col-md-4 col-sm-4 col-xs-6">
                        <div class="movie-block my-2" id=${id} data-v=${trailerUrl}
                         data-title='${title}' data-genre=${genre} data-language=${lannguage}>
                            <img src="${imgSrc}" class="img-fluid">
                            <p>${title}</p>
                        </div>   
                    </div>`;
  if (index === 6 || index % 6 === 0) {
    htmlList += `</div>`;
  }
  if (index % 6 === 0) {
    htmlList += `<div class="row">
    `;
  }
}

function playTrailer(e) {
  $('body')
    .find('#player')
    .parent()
    .next()
    .remove();
  $('body')
    .find('#player')
    .parent()
    .remove();

  const title = e.target.parentElement.getAttribute('data-title');
  const genre = e.target.parentElement.getAttribute('data-genre');
  const language = e.target.parentElement.getAttribute('data-language');

  const playerDiv = `<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 mb-4 text-center">
                    <div class="" id="player"></div>
                    </div>
                    <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 mb-4 text-center">
                    <h2><span> Title: </span> '${title}'<h2>
                    <h4><span> Genre: </span>${genre}<h4>
                    <p><span> Language: </span>${language}<p>
                    </div>`;
  $(e.target)
    .parent()
    .parent()
    .parent()
    .prepend(playerDiv);

  const url = e.target.parentElement.getAttribute('data-v');
  const n = url.indexOf('v=') + 2;
  const urlCode = url.substring(n, n + 11);

  playVideo(urlCode, url);
}

function playVideo(urlCode, url) {
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      // height: '390',
      // width: '640',
      videoId: urlCode,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  }

  function onPlayerReady(event) {
    event.target.playVideo();
  }

  var done = false;
  function onPlayerStateChange(event) {}
  function stopVideo() {
    player.stopVideo();
  }
  onYouTubeIframeAPIReady();
}