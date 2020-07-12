'use strict';

let constraintObj = {
    audio: true,
    video: false
}

navigator.mediaDevices.getUserMedia(constraintObj)
    .then(function (mediaStreamObj) {
        //connect the media stream to the first video element
        let audio = document.querySelector('audio');
        if ("srcObject" in audio) {
            audio.srcObject = mediaStreamObj;
        } else {
            //old version
            audio.src = window.URL.createObjectURL(mediaStreamObj);
        }

        audio.onloadedmetadata = () => {
            //show in the video element what is being captured by the webcam
            audio.play();
        };

        //add listeners for saving video/audio
        let start = document.querySelector('.btn__record');
        let stop = document.querySelector('.btn__stop');
        let audSave = document.getElementById('result');
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        let chunks = [];

        start.addEventListener('click', () => {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
        })
        stop.addEventListener('click', () => {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
        });
        mediaRecorder.ondataavailable = function (ev) {
            chunks.push(ev.data);
        }
        mediaRecorder.onstop = () => {
            let blob = new Blob(chunks, { 'type': 'audio/mp3;' });
            blob.arrayBuffer()
                .then(buffer => console.log('requested array', buffer));
            chunks = [];
            let audioURL = window.URL.createObjectURL(blob);
            console.log('blob', blob);
            console.log('audio src', audioURL);
            audSave.src = audioURL;
        }
    })
    .catch(err => {
        console.log(err.name, err.message);
    });
