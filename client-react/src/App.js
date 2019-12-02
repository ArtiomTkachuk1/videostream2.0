import React, { Component } from 'react'
import MyReactPlayer from './components/ReactPlayer/ReactPlayer'
//import VideoTag from './components/VideoTag/VideoTag'
//import VideojsPlayer from './components/VideojsPlayer/VideojsPlayer'

class App extends Component{
  render(){
    return(
      <React.Fragment>
        <MyReactPlayer
          chunk_max={6}
        />
      </React.Fragment>
    )
  }
}

export default App;
/*
<VideoTag
  chunk_max={6}
/>
*/
