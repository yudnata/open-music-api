require('dotenv').config();

const express = require('express');

const albumsApi = require('./api/albums');
const AlbumsService = require('./api/albums/service');
const AlbumsValidator = require('./validator/albums');

const songsApi = require('./api/songs');
const SongsService = require('./api/songs/service');
const SongsValidator = require('./validator/songs');

const BadRequestError = require('./utils/BadRequestError');
const NotFoundError = require('./utils/NotFoundError');
const AuthenticationError = require('./utils/AuthenticationError');
const AuthorizationError = require('./utils/AuthorizationError');
const InvariantError = require('./utils/InvariantError');

const usersApi = require('./api/users');
const UsersService = require('./api/users/service');
const UsersValidator = require('./validator/users');

const authenticationsApi = require('./api/authentications');
const AuthenticationsService = require('./api/authentications/service');
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require('./token/TokenManager');

const playlistsApi = require('./api/playlists');
const PlaylistsService = require('./api/playlists/service');
const PlaylistsValidator = require('./validator/playlists');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();

  const app = express();
  app.use(express.json());

  app.use(
    '/playlists',
    playlistsApi({
      service: playlistsService,
      validator: PlaylistsValidator,
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
    '/users',
    usersApi({
      service: usersService,
      validator: UsersValidator,
    })
  );

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof BadRequestError) {
      return res.status(err.statusCode).send({
        status: 'fail',
        message: err.message,
      });
    }
    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).send({
        status: 'fail',
        message: err.message,
      });
    }
    if (err instanceof AuthenticationError) {
      return res.status(err.statusCode).send({
        status: 'fail',
        message: err.message,
      });
    }
    if (err instanceof AuthorizationError) {
      return res.status(err.statusCode).send({
        status: 'fail',
        message: err.message,
      });
    }

    if (err.statusCode === 404 || res.statusCode === 404) {
      return res.status(404).send({
        status: 'fail',
        message: 'Resource tidak ditemukan',
      });
    }

    console.error(err.stack);
    return res.status(500).send({
      status: 'error',
      message: 'Terjadi kegagalan pada server kami',
    });
  });

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

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof BadRequestError) {
      return res.status(err.statusCode).send({
        status: 'fail',
        message: err.message,
      });
    }
    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).send({
        status: 'fail',
        message: err.message,
      });
    }
    if (err.statusCode === 404 || res.statusCode === 404) {
      return res.status(404).send({
        status: 'fail',
        message: 'Resource tidak ditemukan',
      });
    }
    if (err instanceof InvariantError) {
      return res.status(err.statusCode).send({
        status: 'fail',
        message: err.message,
      });
    }
    console.error(err.stack);
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
