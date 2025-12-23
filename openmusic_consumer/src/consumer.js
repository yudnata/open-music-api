require('dotenv').config();

const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  console.log('Consumer is running and waiting for messages...');

  channel.consume('export:playlist', async (message) => {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      console.log(`Processing export for playlist: ${playlistId} to: ${targetEmail}`);

      const playlist = await playlistsService.getPlaylistWithSongs(playlistId);

      const result = await mailSender.sendEmail(targetEmail, JSON.stringify({ playlist }));

      console.log(`Email sent successfully: ${result.messageId}`);
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  }, { noAck: true });
};

init();
