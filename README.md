# Slacklator

Slacklator translates a message that is not in English to English by making a post below the original message.

Based on [reacjilator by girliemac](https://github.com/slackapi/reacjilator).

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
TODO

## Development

1. Install (ngrok)[https://dashboard.ngrok.com/get-started] to expose a URL that forwards to the app running locally.
2. `npm run start-dev`
3. `[path to ngrok]/ngrok http 5000`
4. Get the forwarded https URL, append `/events`, and set it as the Request URL under `api.slack.com/apps` -> [App Name] -> Event Subscriptions. 


### Credentials

Rename the `.env_test` to `.env` and fill the env vars with your credentials. You also need Google credentials to use the Google translation API:

Get Your Slack credentials at **Basic Information**, auth token at **OAuth & Permissions**.

Get your Google Cloud project ID and API key at [cloud.google.com](https://cloud.google.com/translate/docs/getting-started)


## Deployment Examples

### Deploy on Google Cloud Functions

Please refer the `google-cloud-functions` branch.

### Deploy on Heroku

Use this Heroku button to deploy to Heroku server. You just need to fill out the env vars with the info. No need to create an `.env` file.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/slackAPI/reacjilator)

*When you deploy to Heroku, the request URL for the **Event Subscription** section on Slack App config page would be: `https://the-name-you-picked.herokuapp.com/events`*
