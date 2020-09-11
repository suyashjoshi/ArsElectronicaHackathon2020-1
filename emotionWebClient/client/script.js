const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height}

  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    // resetColor()

    var l = [];
    var threshold = 0.;
    if(detections[0].expressions.happy > threshold)l.push({"emotion":"happy","val":detections[0].expressions.happy});
    if(detections[0].expressions.angry > threshold)l.push({"emotion":"angry","val":detections[0].expressions.angry});
    if(detections[0].expressions.disgusted > threshold)l.push({"emotion":"disgusted","val":detections[0].expressions.disgusted});
    if(detections[0].expressions.fear > threshold)l.push({"emotion":"fear","val":detections[0].expressions.fear});
    if(detections[0].expressions.surprise > threshold)l.push({"emotion":"surprise","val":detections[0].expressions.surprise});
    if(detections[0].expressions.neutra > threshold)l.push({"emotion":"neutra","val":detections[0].expressions.neutra});
    if(detections[0].expressions.sad > threshold)l.push({"emotion":"sad","val":detections[0].expressions.sad});

    setoutEmotionData(l);

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 200)
})