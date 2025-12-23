const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = ({ collaborationsService, playlistsService, usersService, validator }) => {
  const collaborationsHandler = new CollaborationsHandler(
    collaborationsService,
    playlistsService,
    usersService,
    validator
  );
  return routes(collaborationsHandler);
};
