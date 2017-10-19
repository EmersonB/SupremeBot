running = false
waiting = false
current_state = 'press wait or start'
time_left = -1

worker = new Worker('worker.js')

chrome.runtime.onMessage.addListener(function(r, s, sendResponse) {
  if (r.type == "check"){
    sendResponse({waiting: waiting, running: running, state: current_state, time_until: time_left});
  }
  if (r.type == "url") {
    goToItem(r.url);
  }
  if (r.type == "keep_going"){
    search();
  }
  if (r.type == "run") {
    run()
    //restart worker
    worker.terminate()
    worker = undefined
    worker = new Worker('worker.js')
  }
  if (r.type == "done") {
    goToCheckout();
  }
  if (r.type == "off") {
    running = false;
  }
  if (r.type == "addCode"){
    chrome.storage.sync.get("img_codes", res => {
      if(!res.img_codes.includes(r.code)){
        res.img_codes.push(r.code)


        chrome.storage.sync.set({
          img_codes: res.img_codes
        }, () => { console.log('updated image code')}
        )
      }
      else console.log('added code')
    })
  }
  if(r.type == "getCodes"){
    chrome.storage.sync.get("img_codes", sync => {
      console.log(sync)
      sendResponse({codes: sync.img_codes})
    })
    return true;
  }
})

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request) {
      if (request.message) {
        if (request.message == "version") {
          sendResponse({version: 1.0});
        }
      }
    }
    return true;
  });

function search() {
  if(!running) return;
  var url = "http://www.supremenewyork.com/shop/all"
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
  });
  //chrome.tabs.create({
  //  url: "http://www.supremenewyork.com/shop/all"
  //}, function(tab) {})
}


function goToItem(url) {
  if(!running) return;
  //var bigUrl = "http://www.supremenewyork.com" + url;
  var bigUrl = url;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: bigUrl});
  });

}

function goToCheckout() {
  if(!running) return;
  var url = "https://www.supremenewyork.com/checkout"
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
  })
}

function wait(){
  current_state = 'waiting...'
  waiting = true

  worker.postMessage({waiting: waiting})

  worker.addEventListener('message', function(msg){
    console.log(msg)
    if(msg.data.type == 'update'){
      time_left = msg.data.seconds_until
      chrome.runtime.sendMessage({type: 'update_time', time_until: time_left})
    }
    if(msg.data.type == 'done'){
      run();
    }
  })
}

function stop_wait(){
  waiting = false;
  current_state = 'press wait or start'
  time_until = -1

  //restart worker
  worker.terminate()
  worker = undefined
  worker = new Worker('worker.js')
}


function stop(){
  running = false;
  chrome.storage.sync.set({running: false})
}

function nextDay(x){
  var now = new Date();
  now.setDate(now.getDate() + (x+(7-now.getDay())) % 7);
  if(now.getDay() == 4){
    if(now.getHours() >= 11){
      now.setDate(now.getDate() + 7)
    }
  }
  now.setHours(10)
  now.setMinutes(0)
  now.setSeconds(0)
  now.setMilliseconds(0)
  return now;
}

function run(){
  running = true;
  console.log('running')
  chrome.storage.sync.get('img_codes', function(res){
    chrome.storage.sync.set({
      working_codes: res.img_codes,
      running: true
    })
  })
  search();
}
