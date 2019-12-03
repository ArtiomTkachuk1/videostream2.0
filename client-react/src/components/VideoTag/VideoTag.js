import React from 'react'



export default class VideoTag extends React.Component {
  constructor(props) {
    super(props);
    this.mediaSource = new MediaSource();
    console.log(this.mediaSource);
    this.refStart='http://localhost:3000/assets/chunk';
    this.refEnd=".webm";
    this.chunkSize=5;
    this.mediaSource.addEventListener('sourceopen', this.sourceOpen, { once: true });
    this.src=URL.createObjectURL(this.mediaSource);
    this.state = {chunkNum : -1};
  }
  getChunkPath(){
    this.setState({
      chunkNum:this.state.chunkNum=this.state.chunkNum+1
		});
    let ref=this.refStart+this.state.chunkNum+this.refEnd;
    return ref;
  }
  sourceOpen=()=>{
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

  handleVideoMounted = element => {
    if (element !== null) {
      element.currentTime = 30;
    }
  };

  fetchNextSegment() {
    fetch(this.getChunkPath())
    .then(response => response.arrayBuffer())
    .then(data => {
      const sourceBuffer = this.mediaSource.sourceBuffers[0];
      sourceBuffer.appendBuffer(data);
    });
  }

  timeUpdateHandler=element=>{
    let video=document.getElementById("video");
    let currentChunk=video.currentTime/this.chunkSize;
    if((currentChunk>=this.state.chunkNum)&&(currentChunk+1<this.props.chunk_max)){
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
          VideoTag
        </h1>
        <video
          id="video"
          style={{
  							width:"60%",
  							height:"60%",
  							display:"flex",
  							margin:"auto",
  							backgroundColor:"black",
  						}}
          src={this.src}
          controls={true}
          muted={true}
          autoPlay={true}
          onTimeUpdate={this.timeUpdateHandler}
        />
      </React.Fragment>
    )
  }
}
