function getJson(){
  return $.getJSON("tweets.json");
}
var jsonFile = getJson();

function loadTweets(){
  $.each( jsonFile.responseJSON.reverse() , function(key, val){
    $(".tweets").append('<div class="individual-tweets"><span class="owner">'+val.owner+' Tweetou:</span><p class="content">'+val.content+'</p></div>');
  });
}

$.post = function(url, data, callback, type){
  var newTweet = new Object();
  newTweet.owner = "leo";
  newTweet.content = $("#tweetContent").val();

  jsonFile.responseJSON.push(newTweet);

  $.ajax({
    url: url,
    type: 'POST',
    contentType:'json',
    data: JSON.stringify(jsonFile.responseJSON),
    dataType: 'text'
  });

  $(".tweets").prepend('<div class="individual-tweets"><span class="owner">'+newTweet.owner+' Tweetou:</span><p class="content">'+newTweet.content+'</p></div>');
}

$.edit = function(url, data, callback, type){
  $.ajax({
    url: url,
    type: 'PUT',
    contentType:'json',
    data: JSON.stringify(jsonFile.responseJSON),
    dataType: 'text'
  });
}

$.delete = function(url, data, callback, type){
  $.ajax({
    url: url,
    type: 'DELETE',
    data: data,
    contentType: type
  });
}
