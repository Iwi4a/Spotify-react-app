import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Spotify from 'spotify-web-api-js'


const spotifyApi = new Spotify();

class App extends Component {

  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;

    if(token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = {
      loggedIn : token ? true : false,
      nowPlaying : {
        songName : '',
        songImg : '',
      }
    }
  }
  getHashParams = () => {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying : {
            songName: response.item.name,
            songImg : response.item.album.images[0],
          }
        })
      })
  }

  render() {

    let nowPlaying = null;
    if(this.state.nowPlaying.songName) { 
      nowPlaying = <div>
          <p>{this.state.nowPlaying.songName} is now playing...</p>
          <img src={this.state.nowPlaying.songImg.url} />
        </div>
    }

    return (
      <div className="App">
        <header className="App-header">

          {nowPlaying}
          
          { this.state.loggedIn ? 
              <button onClick={this.getNowPlaying}>Check whats playing</button>
            : 
              <a
                className="App-link"
                href="http://localhost:8898/login"
                target="_blank"
                rel="noopener noreferrer"
              >
                Login to Spotify
              </a>
          }
        </header>
      </div>
    );
  }
}

export default App;
