require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const albumsApi = require('./api/albums');
const songsApi = require('./api/songs');
const usersApi = require('./api/users');
const authenticationsApi = require('./api/authentications');
const playlistsApi = require('./api/playlists');
const collaborationsApi = require('./api/collaborations');
const exportsApi = require('./api/exports');

const AlbumsService = require('./api/albums/service');
const SongsService = require('./api/songs/service');
const UsersService = require('./api/users/service');
const AuthenticationsService = require('./api/authentications/service');
const PlaylistsService = require('./api/playlists/service');
const CollaborationsService = require('./api/collaborations/service');
const AlbumLikesService = require('./services/postgres/AlbumLikesService');
const CacheService = require('./services/redis/CacheService');
const StorageService = require('./services/storage/StorageService');
const ProducerService = require('./services/rabbitmq/ProducerService');

const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');
const AuthenticationsValidator = require('./validator/authentications');
const PlaylistsValidator = require('./validator/playlists');
const CollaborationsValidator = require('./validator/collaborations');
const ExportsValidator = require('./validator/exports');
const UploadsValidator = require('./validator/uploads');

const TokenManager = require('./token/TokenManager');
const ClientError = require('./utils/ClientError');

const upload = multer({
  storage: multer.memoryStorage(),
});

const init = async () => {
  const cacheService = new CacheService();
  const storageService = new StorageService(path.resolve(__dirname, '../uploads/images'));

  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const albumLikesService = new AlbumLikesService(cacheService);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

  app.use(
    '/albums',
    albumsApi({
      service: albumsService,
      albumLikesService,
      storageService,
      validator: AlbumsValidator,
      uploadsValidator: UploadsValidator,
      upload,
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

  app.use(
    '/export',
    exportsApi.register(app, {
      producerService: ProducerService,
      playlistsService,
      validator: ExportsValidator,
    })
  );

  app.use((err, req, res, _next) => {
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

  app.use((req, res) => {
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
