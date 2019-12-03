import React, { Component } from 'react'
import VideoTag from './components/VideoTag/VideoTag'

class App extends Component{
  render(){
    return(
      <React.Fragment>
        <VideoTag
          chunk_max={6}
        />
      </React.Fragment>
    )
  }
}

export default App;
