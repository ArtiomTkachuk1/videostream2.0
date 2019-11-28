"use strict"
const mediaSource = new MediaSource();
const video=document.getElementById("video");
video.addEventListener('timeupdate',timeUpdateHandler);
video.src = URL.createObjectURL(mediaSource);
mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

const refStart="http://localhost:3000/assets/chunk";
const refEnd=".webm";
const chunkSize=5;
var chunkNum=1;

function getChunkPath(){
  let ref=refStart+chunkNum+refEnd;
  chunkNum+=1;
  return ref;
}

function sourceOpen() {
  URL.revokeObjectURL(video.src);
  const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
  //sourceBuffer.mode = 'sequence';
  /*fetch(getChunkPath())
  .then(response => response.arrayBuffer())
  .then(data => {
    sourceBuffer.appendBuffer(data);
  });*/
}

function fetchNextSegment() {
  fetch(getChunkPath())
  .then(response => response.arrayBuffer())
  .then(data => {
    const sourceBuffer = mediaSource.sourceBuffers[0];
    sourceBuffer.appendBuffer(data);
  });
}

function timeUpdateHandler(){
  let currentChunk=(this.currentTime/chunkSize);
  if(currentChunk>=chunkNum){
    fetchNextSegment();
  }
}
