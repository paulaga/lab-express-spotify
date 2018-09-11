require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyparser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Spotify credentials
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.clientId,
  clientSecret : process.env.clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/users/user/:play/playlist/4Q7sxkXzveON4HQYOkctmQ/tracks', (req, res) => {
  spotifyApi.getList()
  .then(data => {
    console.log(data)
    res.render('artist-list',{data:data.body});
  })
  .catch(err => {
    console.log(error)
  })
})

app.get('/artist', (req, res) => {
  const {art} = req.query; 

  spotifyApi.searchArtists(art)
    .then(data => {
      res.render('artist-list',{data:data.body.artists.items});
    })
    .catch(err => {
      console.log(error)
    })
})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log(data)
    res.render('artist-albums',{data:data.body.items});
  })
  .catch(err => {
    console.log(err)
  })

});

const port = 3000;
app.listen(port, () => console.log(`Ready on http://localhost:${port}`));