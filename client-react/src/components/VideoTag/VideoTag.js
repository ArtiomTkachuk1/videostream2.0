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
    this.state = {
      chunkNum : 0,
    };
  }
  getChunkPath(){
    return(this.refStart+this.state.chunkNum+this.refEnd)
  }
  incChunkNum(){
    this.setState({
        chunkNum:this.state.chunkNum=this.state.chunkNum+1
    });
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
      this.incChunkNum();
    });
  }
  /*fetchNextSegment() {
        fetch(this.getChunkPath())
            .then(response => {
                if(response.ok){
                    return(response.arrayBuffer());
                }
                else{
                    throw Error("404");
                }
            })
            .then(data => {
                const sourceBuffer = this.mediaSource.sourceBuffers[0];
                sourceBuffer.appendBuffer(data);
                this.incChunkNum();
            })
    };*/
    timeoutPromise = () => new Promise((resolve) => setTimeout(resolve, 5000));
    fetchRetry = async (url, options) => {
      let n = 1000;
      for (let i = 0; i < n; i++) {
          try {
              return await fetch(this.getChunkPath())
                  .then(response => {
                      if(response.ok){
                          return(response.arrayBuffer());
                      }
                      else{
                          throw Error("404");
                      }
                  })
                  .then(data => {
                      const sourceBuffer = this.mediaSource.sourceBuffers[0];
                      sourceBuffer.appendBuffer(data);
                      this.incChunkNum();
                  })
          }
          catch (err) {
              //setTimeout(()=>'console.log("Wait for chunk number"+this.state.chunkNum)', 5000);
              //await this.timeoutPromise();
              const isLastAttempt = i + 1 === n;
              if (isLastAttempt) throw err;
          }
        }
    };
    timeUpdateHandler=element=>{
        let video = document.getElementById("video");
        let currentChunk = video.currentTime / this.chunkSize;
        if((currentChunk >= (this.state.chunkNum-1))){
          this.fetchRetry();
        }
    };
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
