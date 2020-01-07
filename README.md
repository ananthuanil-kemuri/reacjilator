# Slacklator

Slacklator translates a message that is not in English to English by making a post below the original message.

Based on [reacjilator by girliemac](https://github.com/slackapi/reacjilator).

## Development

1. Install (ngrok)[https://dashboard.ngrok.com/get-started] to expose a URL that forwards to the app running locally.
2. `npm run start-dev`
3. [path to ngrok]/ngrok http 5000
4. Get the forwarded https URL, append `/events`, and set it as the Request URL under `api.slack.com/apps` -> [App Name] -> Event Subscriptions. 


## Set Up Your Slack App

1. Create an app at your Slack App Setting page at [api.slack.com/apps](https://api.slack.com/apps):
2. Enable the workspace events, `reaction_added` and point to `https://your-server.com/events` 
3. Set the following scopes:
 - "chat:write:bot" (Send messages with chat.postMessage by a bot),
 - "reactions:read" (Access the workspace’s emoji reaction history)
 - "channels:read" (Access public channels info)
 - "*:history" (Access user's  channels)
4. Install the app and get a user token, begins with `xoxp-`

### Credentials

Rename the `.env_test` to `.env` and fill the env vars with your credentials. You also need Google credentials to use the Google translation API:

```
SLACK_SIGNING_SECRET=
SLACK_AUTH_TOKEN=
GOOGLE_PROJECT_ID=
GOOGLE_KEY=
```

Get Your Slack credentials at **Basic Information**, auth token at **OAuth & Permissions**.

Get your Google Cloud project ID and API key at [cloud.google.com](https://cloud.google.com/translate/docs/getting-started)


## Deployment Examples

### Deploy on Google Cloud Functions

Please refer the `google-cloud-functions` branch.

### Deploy on Heroku

Use this Heroku button to deploy to Heroku server. You just need to fill out the env vars with the info. No need to create an `.env` file.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/slackAPI/reacjilator)

*When you deploy to Heroku, the request URL for the **Event Subscription** section on Slack App config page would be: `https://the-name-you-picked.herokuapp.com/events`*
