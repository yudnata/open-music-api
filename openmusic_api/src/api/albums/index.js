const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = ({
  service,
  albumLikesService,
  storageService,
  validator,
  uploadsValidator,
  upload,
}) => {
  const albumsHandler = new AlbumsHandler(
    service,
    albumLikesService,
    storageService,
    validator,
    uploadsValidator
  );
  return routes(albumsHandler, upload);
};
