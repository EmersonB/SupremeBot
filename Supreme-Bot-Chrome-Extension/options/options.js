function save_options() {
  var category = document.getElementById('category').value.split(',');
  var model = document.getElementById('model').value;
  var color = document.getElementById('color').value;
  var sizes = document.getElementById('size').value.split(',');
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var phone = document.getElementById('phone').value;
  var address = document.getElementById('address').value;
  var address2 = document.getElementById('address-2').value;
  var zip = document.getElementById('zip').value;
  var city = document.getElementById('city').value;
  var state = document.getElementById('state').value;
  var country = document.getElementById('country').value;
  var card_type = document.getElementById('card-type').value;
  var card_number = document.getElementById('card-num').value;
  var exp_mon = document.getElementById('exp-mon').value;
  var exp_yr = document.getElementById('exp-yr').value;
  var cvv = document.getElementById('cvv').value;

  var buy_auto = document.getElementById('auto').checked;

  chrome.storage.sync.set({
    category: category,
    model: model,
    color: color,
    sizes: sizes,
    name: name,
    email: email,
    phone: phone,
    address: address,
    address2: address2,
    zip: zip,
    city: city,
    state: state,
    country: country,
    card_type: card_type,
    card_number: card_number,
    exp_mon: exp_mon,
    exp_yr: exp_yr,
    cvv: cvv,
    buy_auto: buy_auto,
    running: false

  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function init() {
  chrome.storage.sync.get({
    category: '',
    model: '',
    color: '',
    sizes: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    zip: '',
    city: '',
    state: '',
    country: '',
    card_type: '',
    card_number: '',
    exp_mon: '',
    exp_yr: '',
    cvv: '',
    buy_auto: false,
    running: false

  }, function(items) {
    document.getElementById('category').value = items.category;
    document.getElementById('model').value = items.model;
    document.getElementById('color').value = items.color;
    document.getElementById('size').value = items.sizes;
    document.getElementById('name').value = items.name;
    document.getElementById('email').value = items.email;
    document.getElementById('phone').value = items.phone;
    document.getElementById('address').value = items.address;
    document.getElementById('address-2').value = items.address2;
    document.getElementById('zip').value = items.zip;
    document.getElementById('city').value = items.city;
    document.getElementById('state').value = items.state;
    document.getElementById('country').value = items.country;
    document.getElementById('card-type').value = items.card_type;
    document.getElementById('card-num').value = items.card_number;
    document.getElementById('exp-mon').value = items.exp_mon;
    document.getElementById('exp-yr').value = items.exp_yr;
    document.getElementById('cvv').value = items.cvv;
    document.getElementById('auto').checked = items.buy_auto;

    //load json with items

  });

}

function display_items(items){
  item_list = document.getElementById('item-list')

  for(i in items){
    i = items[i]
    item = document.createElement('li')
    item.classList.add('list-group-item')
    btn = '<button id="'+i.alt+'" type="button" class="btn btn-sm btn-primary float-sm-right">add</button>'
    item.innerHTML = i.title + '\t' + i.color + '\t' + btn

    item_list.appendChild(item)

    btn = document.getElementById(i.alt)
    btn.onclick = function(e) {

      //togggle btn and update item list
      toggleBtn(e.target.id)
    }
  }
}

function toggleBtn(id){
  elt = document.getElementById(id)
  //we just added this, change to blue
  if(hasClass(id, 'btn-primary')){
    elt.classList.remove('btn-primary')
    elt.classList.add('btn-success')
    elt.innerHTML = 'added'

    codes = document.getElementById('img_codes')
    if(codes.value.length == 0) newCodes = id
    else newCodes = codes.value + ',' + id

    codes.value = newCodes

  }
  else{
    elt.classList.remove('btn-success')
    elt.classList.add('btn-primary')
    elt.innerHTML = 'add'

    codes = document.getElementById('img_codes')
    current_items = codes.value.split(',')
    new_items = ''
    for(item in current_items){
      item = current_items[item]
      if(item != id){
        new_items += item + ','
      }
    }

    codes.value = new_items.substring(0, new_items.length - 1) //chop off last ,


  }
}

function hasClass(id, className){
  elt = document.getElementById(id)
  list = elt.classList.value.split(' ')
  return list.indexOf(className) > -1
}

document.addEventListener('DOMContentLoaded', init);
document.getElementById('save').addEventListener('click', save_options);


$(function(){
  jQuery.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
  };

  $('#item-search').bind("propertychange input", function(e){
    item = e.target.value
    $('#item-list > li:not(:icontains('+item+'))').hide();
    $('#item-list > li:icontains('+item+')').show();
  })


})
