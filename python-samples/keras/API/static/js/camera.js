"use strict";

//Uma prática muito comum: verifica se o objeto desejado existe,
//caso contrário, "cria" o objeto atribuindo a ele outro(s) que
//pode(m) existir naquele browser em especial...
if (!navigator.getUserMedia) {
  navigator.getUserMedia =
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
}
if (!window.URL) {
  window.URL = window.webkitURL;
}

var turningOn,
  preview,
  previewSrc,
  previewOk,
  cameraStream,
  photo,
  photoContext,
  mirror = false;

function downloadPhoto(data, name) {
  //Gambiarra massiva para salvar o arquivo (simular o clique de um link)!
  //(Ver: http://updates.html5rocks.com/2011/08/Saving-generated-files-on-the-client-side)

  //Cria um elemento <a> (link) utilizando o DOM
  var a = document.createElement("a"),
    evt;
  //Especifica o endereço da foto que será baixada
  a.href = data;
  //Especifica o nome da foto que será baixada
  a.download = name;
  //Cria o evento do "clique" falsificado
  evt = document.createEvent("MouseEvents");
  evt.initMouseEvent(
    "click",
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  //Executa o "clique" ;)
  a.dispatchEvent(evt);
}

function downloadPNG() {
  //Comprime a foto em PNG
  var data = photo.toDataURL("image/png");
  //Faz o download da foto
  console.log(data);

  downloadPhoto(data, "Foto.png");
  //
  //*** A foto terá o tamanho do canvas, portanto, terá 300px de largura...
  //Para fazer o download de uma foto com o tamanho original do vídeo
  //(preview.videoWidth e preview.videoHeight) é preciso aumentar o tamanho
  //do canvas na tela, ou criar outro canvas escondido! ;)
  //
}

function downloadJPEG() {
  //Comprime a foto em JPEG (qualidade de 85%)
  debugger;
  var data = photo.toDataURL("image/jpeg", 0.85);
  //Faz o download da foto
  downloadPhoto(data, "Foto.jpg");
  //
  //*** A foto terá o tamanho do canvas, portanto, terá 300px de largura...
  //Para fazer o download de uma foto com o tamanho original do vídeo
  //(preview.videoWidth e preview.videoHeight) é preciso aumentar o tamanho
  //do canvas na tela, ou criar outro canvas escondido! ;)
  //
}

function adjustPreview() {
  //Utiliza a variável previewOk para garantir que esse código seja executado apenas uma vez!
  if (!previewOk) {
    //Regra de 3: redimensiona o elemento do vídeo e o canvas, para que fiquem
    //com uma largura de 300px e com uma altura proporcional ao vídeo da câmera
    //
    //O | 0 no final é para truncar o resultado rapidamente....
    //Venha falar comigo que eu explico pessoalmente ;)
    var height = ((preview.videoHeight * 300) / preview.videoWidth) | 0;
    if (height && !isNaN(height) && isFinite(height)) {
      preview.height = height;
      photo.height = height;
      preview.style.visibility = "";
      photo.style.visibility = "";
      previewOk = true;

      takePhoto();

      return true;
    }
    return false;
  }
  return true;
}

function waitToAdjust() {
  if (!adjustPreview()) {
    //Pois é... não rolou... Mostra de qualquer jeito... :(
    preview.style.visibility = "";
    photo.style.visibility = "";
  }
  return true;
}

function getUserMedia_Success(mediaStream) {
  turningOn = false;
  //Especifica o tratador do evento "canplay", que é executado quando o
  //vídeo foi carregado, e já está pronto para reproduzir
  preview.addEventListener("canplay", adjustPreview);
  //Às vezes, canplay não é chamado, dependendo do browser... :(
  preview.addEventListener("loadeddata", adjustPreview);
  preview.addEventListener("resize", adjustPreview);
  //Às vezes, o browser não chama NENHUM, aí nós esperamos um tempinho
  setTimeout(waitToAdjust, 2500);
  if ("srcObject" in preview) {
    //Novo modelo de funcionamento
    previewSrc = null;
    preview.srcObject = mediaStream;
  } else if ("mozSrcObject" in preview) {
    //Alguns Firefox trabalham de jeito diferente...
    previewSrc = null;
    preview.mozSrcObject = mediaStream;
  } else {
    //Para os outros browsers, basta criar uma URL para encapsular o stream, e pronto!
    previewSrc = URL.createObjectURL(mediaStream);
    preview.src = previewSrc;
  }
  //Reproduz o vídeo, efetivamente exibindo o conteúdo da câmera na página
  preview.play();
  //Armazena o stream para uso futuro
  cameraStream = mediaStream;
}

function getUserMedia_Error(error) {
  turningOn = false;
  alert("Erro ao obter acesso à câmera: " + error);
}

function turnCameraOn() {
  //Previne múltiplas inicializações
  if (turningOn) return true;
  turningOn = true;
  //Tenta obter acesso à camera
  navigator.getUserMedia(
    { video: true, audio: false },
    getUserMedia_Success,
    getUserMedia_Error
  );
}

function turnCameraOff() {
  //Previne que a câmera seja desligada em momentos inapropriados
  if (turningOn || !cameraStream) return;
  //Limpa todas as estruturas relacionadas
  preview.removeEventListener("canplay", adjustPreview);
  preview.removeEventListener("loadeddata", adjustPreview);
  preview.removeEventListener("resize", adjustPreview);
  if (preview.pause) preview.pause();
  if (cameraStream.stop) cameraStream.stop();
  if (cameraStream.getTracks) {
    var track = cameraStream.getTracks();
    if (track && (track = track[0]) && track.stop) track.stop();
  }
  if ("srcObject" in preview) preview.srcObject = null;
  else if ("mozSrcObject" in preview) preview.mozSrcObject = null;
  else preview.src = "";
  previewOk = false;
  if (previewSrc) {
    URL.revokeObjectURL(previewSrc);
    previewSrc = null;
  }
  cameraStream = null;
}

function takePhoto() {
  //Desenha o vídeo atualmente exibido no canvas, espelhado horizontalmente quando necessário
  if (mirror) photoContext.setTransform(-1, 0, 0, 1, photo.width, 0);
  photoContext.drawImage(preview, 0, 0, photo.width, photo.height);
  if (mirror) photoContext.setTransform(1, 0, 0, 1, 0, 0);
}

function mirrorOn() {
  if (mirror) return;
  mirror = true;
  //Inverte o vídeo horizontalmente, conforme o valor do checkbox
  if ("transform" in preview.style) preview.style.transform = "scaleX(-1)";
  if ("mozTransform" in preview.style)
    preview.style.mozTransform = "scaleX(-1)";
  if ("webkitTransform" in preview.style)
    preview.style.webkitTransform = "scaleX(-1)";
  if ("oTransform" in preview.style) preview.style.oTransform = "scaleX(-1)";
}

function mirrorOff() {
  if (!mirror) return;
  mirror = false;
  //Inverte o vídeo horizontalmente, conforme o valor do checkbox
  if ("transform" in preview.style) preview.style.transform = "";
  if ("mozTransform" in preview.style) preview.style.mozTransform = "";
  if ("webkitTransform" in preview.style) preview.style.webkitTransform = "";
  if ("oTransform" in preview.style) preview.style.oTransform = "";
}

if (!navigator.getUserMedia) {
  alert(
    "Aparentemente seu browser não possui a API necessária para acessar a câmera! \uD83D\uDE22"
  );
} else {
  //Obtém o vídeo da página (onde será exibido o preview)
  preview = document.getElementById("preview");
  //Inverte o filme horizontalmente
  mirrorOn();
  //Ver explicação na função preview_CanPlay
  previewOk = false;
  //Obtém o canvas da página (onde será exibida a foto tirada)
  photo = document.getElementById("photo");
  //Obtém o contexto de desenho do canvas (utilizado para desenhar)
  photoContext = photo.getContext("2d");

  //Não é mais possível obter o acesso à câmera, sem que o usuário
  //com a página antes...
  turnCameraOn();
}


function getData() {
  let base64 = photo.toDataURL("image/png").split(",")[1]
  let data = {"base": base64 };
  let done = false;
  let xhr = new XMLHttpRequest();
  xhr.open("post", "/predict", true);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && !done) {
      // debugger;
      done = true;
      if (xhr.status === 200) {
        var j = xhr.responseText;
        var obj = JSON.parse(j);
        console.log(obj);
      } else {
        console.log(xhr.status);
      }
    }
  };
  xhr.send(JSON.stringify(data));
}
