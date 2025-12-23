require('dotenv').config();

const express = require('express');
const cors = require('cors');

const albumsApi = require('./api/albums');
const songsApi = require('./api/songs');
const usersApi = require('./api/users');
const authenticationsApi = require('./api/authentications');
const playlistsApi = require('./api/playlists');
const collaborationsApi = require('./api/collaborations');

const AlbumsService = require('./api/albums/service');
const SongsService = require('./api/songs/service');
const UsersService = require('./api/users/service');
const AuthenticationsService = require('./api/authentications/service');
const PlaylistsService = require('./api/playlists/service');
const CollaborationsService = require('./api/collaborations/service');

const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');
const AuthenticationsValidator = require('./validator/authentications');
const PlaylistsValidator = require('./validator/playlists');
const CollaborationsValidator = require('./validator/collaborations');

const TokenManager = require('./token/TokenManager');
const ClientError = require('./utils/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(
    '/albums',
    albumsApi({
      service: albumsService,
      validator: AlbumsValidator,
    })
  );
  app.use(
    '/songs',
    songsApi({
      service: songsService,
      validator: SongsValidator,
    })
  );
  app.use(
    '/users',
    usersApi({
      service: usersService,
      validator: UsersValidator,
    })
  );
  app.use(
    '/authentications',
    authenticationsApi({
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    })
  );
  app.use(
    '/playlists',
    playlistsApi({
      service: playlistsService,
      validator: PlaylistsValidator,
    })
  );

  app.use(
    '/collaborations',
    collaborationsApi({
      collaborationsService,
      playlistsService,
      usersService,
      validator: CollaborationsValidator,
    })
  );

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof ClientError) {
      return res.status(err.statusCode).send({
        status: 'fail',
        message: err.message,
      });
    }

    console.error(err);

    return res.status(500).send({
      status: 'error',
      message: 'Terjadi kegagalan pada server kami',
    });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((req, res, next) => {
    res.status(404).send({
      status: 'fail',
      message: 'Endpoint tidak ditemukan',
    });
  });

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 5000;

  app.listen(port, host, () => {
    console.log(`Server berjalan pada http://${host}:${port}`);
  });
};

init();
