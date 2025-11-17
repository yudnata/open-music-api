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

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const app = express();
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
