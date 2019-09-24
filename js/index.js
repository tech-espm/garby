// teste
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
  console.log("good to go");
} else {
  alert("getUserMedia() is not supported by your browser");
}
// pegar camera
const constraints = {
  video: true
};

const video = document.querySelector("video");

navigator.mediaDevices.getUserMedia(constraints).then(stream => {
  video.srcObject = stream;
});