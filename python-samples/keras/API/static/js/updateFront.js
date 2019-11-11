setInterval(() => {
  getData();
}, 10000);

function getData() {
  takePhoto();
  let base64 = photo.toDataURL('image/png').split(',')[1];
  let data = { base: base64 };
  let done = false;
  let xhr = new XMLHttpRequest();
  xhr.open('post', '/predict', true);
  let title = document.getElementById('item-type');
  let overlay = document.getElementById('divOverlay');
  overlay.classList.remove(...overlay.classList);
  title.setAttribute('style', 'color: #fff');
  title.innerHTML = 'Loading...';
  overlay.classList.add('black');
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && !done) {
      done = true;
      if (xhr.status === 200) {
        var j = xhr.responseText;
        var obj = JSON.parse(j);
        console.log(obj.materialType);
        updateWindow(obj.materialType);
        // updateWindow(0);
      } else {
        console.log(xhr.status);
      }
    }
  };
  xhr.send(JSON.stringify(data));
}

function updateWindow(type) {
  type = parseInt(type);
  let title = document.getElementById('item-type');
  let overlay = document.getElementById('divOverlay');
  let body = document.getElementsByTagName('body')[0];
  let materials = {
    Vidro: 0,
    Metal: 1,
    Papel: 2,
    Plastico: 3,
    Lixo: 4
  };
  console.log('type:');
  let guessedType = getKeyByValue(materials, type);

  if (type === 0) {
    overlay.classList.remove(...overlay.classList);
    title.setAttribute('style', 'color: #000');
    title.innerHTML = guessedType;
    body.setAttribute('style', 'background-color: #0f0');
    overlay.classList.add('green');
  } else if (type === 1) {
    overlay.classList.remove(...overlay.classList);
    title.setAttribute('style', 'color: #fff');
    title.innerHTML = guessedType;
    body.setAttribute('style', 'background-color: #ff0');
    overlay.classList.add('yellow');
  } else if (type === 2) {
    overlay.classList.remove(...overlay.classList);
    title.setAttribute('style', 'color: #fff');
    title.innerHTML = guessedType;
    body.setAttribute('style', 'background-color: #00f');
    overlay.classList.add('blue');
  } else if (type === 3) {
    overlay.classList.remove(...overlay.classList);
    title.setAttribute('style', 'color: #000');
    title.innerHTML = guessedType;
    body.setAttribute('style', 'background-color: #f00');
    overlay.classList.add('red');
  } else if (type === 4) {
    overlay.classList.remove(...overlay.classList);
    title.setAttribute('style', 'color: #fff');
    title.innerHTML = guessedType;
    body.setAttribute('style', 'background-color: #000');
    overlay.classList.add('black');
  }
}

function getKeyByValue(object, value) {
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (object[prop] === value) return prop;
    }
  }
}
