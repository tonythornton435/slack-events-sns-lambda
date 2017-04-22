# Slack Events API Endpoint on AWS Lambda

This repo will provide a [Slack Events API][events-api] endpoint on AWS API
Gateway and Lambda to process Slack events. Out of the box, it merely responds
to the [verification challenge][challenge] that Slack sends. However, it can be
easily extended to respond to other event types.

## Slack app configuration

There are many guides that can help you create and configure your Slack app.
[Slack’s own documentation][app-config] is quite good.

## Configuration

Put your app verification token (and any other secrets required by your app) in
a file named `.env` in the root of the repo:

```
SLACK_APP_VERIFICATION_TOKEN=your token here
```

This token will be accessible as `process.env.SLACK_APP_VERIFICATION_TOKEN` in
your code.

## Creating and updating the endpoint

[Claudia][claudia] makes creating and updating the endpoint easy. Make sure
your AWS credentials are available to your command-line environment.

```
claudia create --name my-slack-endpoint --region us-east-1 --api-module index
```

Claudia will print out the endpoint base URL. Append `/messages` to the end,
provide it to Slack in the "Event Subscriptions" section of your app
configuration, and they will send the verification challenge.

If you make changes to the code, you can update the endpoint with:

```
claudia update
```

[events-api]: https://api.slack.com/events-api
[challenge]: https://api.slack.com/events/url_verification
[app-config]: https://api.slack.com/slack-apps
[claudia]: https://claudiajs.com
