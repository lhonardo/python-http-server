var jsonSize = 0;

function loadTweets(){
  $.getJSON("tweets.json" , function(data){
    if (data.length !== jsonSize){
      jsonSize = data.length;
      $(".tweets").empty();
      $.each( data.reverse() , function(key, val){
          $(".tweets").append('<div class="individual-tweets"><span class="owner">'+val.owner+'</span><span> Tweetou:</span><p class="content '+ val.owner +'">'+ val.content + '</p></div>');
      });
    }
  });
}


function editInput(element){
  $(element).replaceWith(function(){
      return $('<input/>', {
                'class': this.className,
                 content: this.value
             })
  })
};

function addEdit(){
  $.each( $(".individual-tweets .content") , function(k, v){
    if ((v.className.indexOf(localStorage['owner']) >= 0)){
      this.className += " editable";
    }
  });
}

$.post = function(url, data, callback, type){
  var newTweet = new Object();
  newTweet.owner = localStorage['owner'];
  newTweet.content = $("#tweetContent").val();

  $.getJSON("tweets.json" , function(data){
    data.push(newTweet);
    $.ajax({
      url: url,
      type: 'POST',
      contentType:'json',
      data: JSON.stringify(data),
      dataType: 'text'
    });

   });

  $(".tweets").prepend('<div class="individual-tweets"><span class="owner">'+newTweet.owner+'</span><span> Tweetou:</span><p class="content">'+newTweet.content+'</p></div>');

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

