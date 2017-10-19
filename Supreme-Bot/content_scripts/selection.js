//we are in /shop/all
chrome.storage.sync.get(['category','model','color','size'], function(res){
  //var working_codes = res.working_codes;
  //current_code = working_codes[working_codes.length - 1]
  //console.log(current_code)
  console.log(res.category)

  //var url = $('img[alt="'+ current_code +'"]').parent().attr("href");
  $.ajax({
   type: "POST",
   url: 'http://localhost:8080/api/supreme',
   data: {
       'data': {"categories": res.category, "model": res.model, "color": res.color, "size": res.size}
   },
   dataType: 'json',
   success: function(data){
     url = data['url'][0]
     console.log(url)

     if(url=="error"){
       //try again after 250ms
       setTimeout(function(){
         console.log('Item Not Found');
         chrome.runtime.sendMessage({type: "keep_going"}, function(res){});
       }, 250);
     }
     else chrome.runtime.sendMessage({type: "url", url: url}, function(res){});

 },
   error: function(xhr, status, error) {
    console.log('error');
  }

 });
  //if not found on shop
  // setTimeout(function(){
  //   console.log('Item Not Found');
  //   chrome.runtime.sendMessage({type: "keep_going"}, function(res){});
  // }, 250);

})
