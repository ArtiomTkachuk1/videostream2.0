import React,{Component} from 'react'
//import ReactPlayer from 'react-player'



export default class MyReactPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.mediaSource=new mediaSource();
    this.refStart='http://localhost:3000/assets/chunk';
    this.refEnd=".webm";
    this.chunkSize=5;
    this.mediaSource.addEventListener('sourceopen', this.sourceOpen, { once: true });
    this.src=URL.createObjectURL(this.MediaSource);
    this.state = {chunkNum : -1};
  }
  getChunkPath(){
    this.setState({
      chunkNum:this.state.chunkNum+1
		});
    let ref=this.refStart+this.state.chunkNum+this.refEnd;
    return ref;
  }
  sourceOpen() {
    URL.revokeObjectURL(this.src);
    const sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
    sourceBuffer.mode = 'sequence';
    console.log(this.mediaSource.sourceBuffers);
    fetch(this.getChunkPath())
    .then(response => response.arrayBuffer())
    .then(data => {
      sourceBuffer.appendBuffer(data);
    });
  }
  fetchNextSegment() {
    fetch(this.getChunkPath())
    .then(response => response.arrayBuffer())
    .then(data => {
      const sourceBuffer = this.mediaSource.sourceBuffers[0];
      sourceBuffer.appendBuffer(data);
    });
  }

  timeUpdateHandler(){
    let currentChunk=this.currentTime/this.chunkSize;
    if(currentChunk>=this.chunkNum){
      this.fetchNextSegment();
    }
  }
  render(){
    return (
      <React.Fragment>
        <h1
        style={{
              justifyContent:"center",
              display:"flex",
              margin:"auto",
            }}
        >
          React player
        </h1>
        <video
          style={{
  							width:"120%",
  							height:"80%",
  							display:"flex",
  							margin:"auto",
  							backgroundColor:"black",
  						}}
          src={this.src}
        />
      </React.Fragment>
    )
  }
}
