const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  register: (app, { producerService, playlistsService, validator }) => {
    const exportsHandler = new ExportsHandler(
      producerService,
      playlistsService,
      validator
    );
    return routes(exportsHandler);
  },
};
