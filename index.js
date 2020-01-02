/* ***************************************************
 * Reacilator for Slack
 * Translate message when a user reacted with an emoji
 * Tomomi Imura (@girlie_mac)
 * ****************************************************/

 /* Slack App setup
  * Enable events: "reaction_added"
  * Enable Bot user
  * Scopes: "chat:write:bot" (Send messages with chat.postMessage by a bot),
  *         "reactions:read" (Access the workspace’s emoji reaction history)
  *         "*:read" (Access channels info)
  *         "*:history" (Access channels history)
  */

 /* Google Cloud setup
  * API Key https://cloud.google.com/translate/docs/getting-started
  * Node Lib https://www.npmjs.com/package/@google-cloud/translate
  */

const express = require('express');
const dotenv = require('dotenv');

const setupBodyParser = require('./setupBodyParser');
const setupEventsRoute = require('./setupEventsRoute');

dotenv.config();

const app = express();

setupBodyParser(app);
setupEventsRoute(app);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});