# Diplobot

Diplobot is a Slack app that translates messages automatically or manually to a target message. It currently supports English/Chinese as target languages.

Based on [reacjilator by girliemac](https://github.com/slackapi/reacjilator).

## Credentials

Duplicate the `.env-test` file to `.env`. See instructions below for how to obtain credentials/API keys for Slack and Google Cloud Translation API.

## Set Up Your Slack App

1. Create an app at your Slack App Setting page at [api.slack.com/apps](https://api.slack.com/apps):
2. In Settings -> Basic Information -> Add features and functionality -> Bots, set up the bot user, set its Display and Default names, and enable "Always Show My Bot as Online".
3. Under OAuth & Permissions, add the following Bot Token Scopes:
 - "channels:history"
 - "channels:read"
 - "chat:write"
 - "groups:history"
 - "im:history"
 - "im:read"
 - "mpim:history"
4. Get the bot user token in the same page, begins with `xoxb-`. Add it to the `.env` file as `SLACK_BOT_USER_ACCESS_TOKEN`.
5. Copy the following env vars into `.env` from the Settings -> Basic Information page:
 - "Client ID" -> `SLACK_CLIENT_ID`
 - "Client Secret" -> `SLACK_CLIENT_SECRET`
 - "Singing Secret" -> `SLACK_SIGNING_SECRET`
6. Under Event Subscriptions, enable Events. 
7. Subscribe to the following bot events:
 - "message.channels"
 - "message.group"
 - "message.im"
 - "messsage.mpim"

## Set Up Your Google Cloud Project

1. Create a new Google Cloud project at [Google Cloud](https://console.cloud.google.com/).
2. Add the project id to `.env` as `GOOGLE_PROJECT_ID`.
2. Enable the `Cloud Translation API`.
2. Create an API Key and restrict it to `Cloud Translation API`.
3. Add the key to `.env` under `GOOGLE_TRANSLATE_API_KEY`

## Development

Requirements:

- node v10+
- npm
- sequelize CLI: `npm i -g sequelize-cli`
- (ngrok)[https://dashboard.ngrok.com/get-started]: to expose a URL which tunnels to local port for Slack API events.

1. `npm run start-dev`
2. `[path to ngrok]/ngrok http 5000`
3. Get the forwarded https URL, append `/events`, and set it as the Request URL under `api.slack.com/apps` -> [App Name] -> Event Subscriptions. 
4. Start the db: `docker run --name reacjilator-db --publish 6000:5432 --env POSTGRES_USER=admin --env POSTGRES_PASSWORD=admin --env POSTGRES_DB=diplobot --detach postgres:10.6`

```sh
# Generating db models
sequelize model:create --name [Table Name] --attributes [column1]:[type], [column2]:[type] 

# Upgrading dev database schema
sequelize db:migrate
```

## Deployment

### Heroku

1. `git remote set-url heroku https://git.heroku.com/slack-reacjilator.git` (first time only)
2. `git push heroku`
3. Set the env vars in [Heroku](https://dashboard.heroku.com/apps/slack-reacjilator/settings)

*When you deploy to Heroku, the request URL for the **Event Subscription** section on Slack App config page would be: `https://slack-reacjilator.herokuapp.com/events`*

### Rolling back to a previous commit
1. `git checkout [commit hash]`
2. `git push heroku HEAD:master -f`