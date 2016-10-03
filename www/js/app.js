var jsonSize = 0;

function loadTweets(){
  $.getJSON("tweets.json" , function(data){
    if (data.length !== jsonSize){
      jsonSize = data.length;
      $(".tweets").empty();
      $.each( data , function(key, val){
          if (val.owner == localStorage['owner']){
            $(".tweets").prepend('<div class="individual-tweets"><span class="editInfo" name="editInfo" style="display:none">Editar</span><span class="owner">'+val.owner+'</span><span> Tweetou:</span><p id="'+key+'" class="content '+ val.owner +'">'+ val.content + '</p></div>');
          }else{
            $(".tweets").prepend('<div class="individual-tweets"><span class="owner">'+val.owner+'</span><span> Tweetou:</span><p id="'+key+'" class="content '+ val.owner +'">'+ val.content + '</p></div>');
          }
      });
    }
  });
}

function editTweet(element){
  $("#edit").show();
  $("#editInput").val(element.textContent);
  $(".cancelButton").click(function(){
    $("#edit").hide();
  });

  $(".editButton").click(function(){
    $.getJSON("tweets.json" , function(data){
      data[element.id].content = $("#editInput").val();
      $.put(data);
      element.textContent = $("#editInput").val();
      $("#edit").hide();
    });
  });

};

function addEdit(){
  $.each( $(".individual-tweets .content") , function(k, v){
    if ((v.className.indexOf(localStorage['owner']) >= 0)){
      this.className += " editable";
    }
  });
}

$.put = function(data, url){
    console.log(data);
    $.ajax({
      url: url,
      type: 'PUT',
      contentType:'json',
      data: JSON.stringify(data),
      dataType: 'text'
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

    var key = data.length-1;
    $(".tweets").prepend('<div class="individual-tweets"><span class="owner">'+newTweet.owner+'</span><span> Tweetou:</span><p id="'+key+'" class="content '+newTweet.owner+'">'+newTweet.content+'</p></div>');

   });


}

$.deleleTweets = function(url, data, callback, type){
  $.ajax({
    url: url,
    type: 'DELETE',
    data: data,
    contentType: type
  });
}

