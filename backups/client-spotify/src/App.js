//import logo from './logo.svg';
import './App.css';
import React from 'react';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends React.Component {
    constructor(props){
        super(props);
        const parametros = this.getAuth();
        const token = parametros.access_token;
        console.log(parametros);

        if (token) {
            console.log("Token recebido!!")
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: token ? true : false,
            idUsuario: null,
            nowPlaying: { name: 'Not Checked', albumArt: '' },
            playlistsUsuario: [],
            aindaTemPlaylist: {offset: 0, limit: 50},
            totalMusicasPlaylist: null

        }

    }

    //getAuth() - Código pronto que recebe o access_token e refresh_token do usuario.
    getAuth() {
        let hashParams = {};
        let e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);

        e = r.exec(q);
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    //getUserID() -> Recebe o id do usuário autenticado
    getUserID(){
        spotifyApi.getMe()
            .then((response) => {
                console.log(response);
                this.setState({
                    idUsuario: response.id
                });
            })
    }

    //getNowPlaying() -> Recebe informações da música escutada no momento pelo usuário autenticado
    getNowPlaying(){
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        albumArt: response.item.album.images[0].url
                    }
                });
            })
    }

    //getNowPlaying() -> Recebe informações de todas as playlists do usuário autenticado
    getPlaylistsUsuario(){
        //PROBLEMA ATUAL - NÃO RECEBE MAIS QUE 20 PLAYLISTS, VERIFICAR COMO RECEBER *TODAS* AS PLAYLISTS
        spotifyApi.getUserPlaylists(this.idUsuario, this.aindaTemPlaylist)
            .then((response) => {
                console.log(response);

                if(response.offset === 0){
                    console.log("OFFSet 0")
                    this.setState({
                        playlistsUsuario: response.items,
                        aindaTemPlaylist: {offset: response.limit, limit: 50},
                        totalMusicasPlaylist: response.total
                    }
                )}
                else{
                    console.log("OFFSET !=")
                    while(response.next !== null) {
                        console.log(response.next)
                        let nvPosicao = this.playlistsUsuario.length;

                        this.setState({
                            aindaTemPlaylist: {offset: parseInt(this.aindaTemPlaylist.offset) + nvPosicao, limit: 50},
                        })

                        this.getPlaylistsUsuario(nvPosicao);
                    }
                }
            })
    }

    //unindo todas as funcoes
    getAll(){
        this.getPlaylistsUsuario();
        this.getUserID();
        this.getNowPlaying();
    }


  render () {
    return (
      <div className="App">
          <button><a href="http://localhost:8888/login"> Logue com o Spotify </a></button>

          <div>
              Tocando Agora: { this.state.nowPlaying.name }
          </div>
          <div>
              <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
          </div>


          {/*SE O USUÁRIO ESTIVER LOGADO, ELE MOSTRA O BOTÃO*/

              this.state.loggedIn &&
              <button onClick={() => this.getAll()/*this.getNowPlaying() && this.getPlaylistsUsuario()*/}>
                  Check Now Playing
              </button>}
          <div>
              Id do usuario: { this.state.idUsuario }
          </div>
          {this.state.playlistsUsuario.map((val, key) => {
              console.log(val);

              if(val.images.length > 0){
                  return <div>
                      <p key={"P_"+val.id}> {val.id} - {val.name} (Com IMG)</p>
                      <img key={"IMG_"+val.id} src={val.images[0].url} style={{ height: 150 }} alt={val.id + val.name}/>
                  </div>;
              }
              else {
                  return <div>
                      <p key={"P_" + val.id}> {val.id} - {val.name}</p>
                  </div>;
              }
          })}
      </div>
    );
  }
}

export default App;


