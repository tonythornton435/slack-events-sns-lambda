# Slack Events to SNS via AWS Lambda

This repo provides a [Slack Events API][events-api] endpoint on AWS API Gateway
and Lambda to process Slack events. It handles the endpoint verification and
then publishes the events to SNS.

## Configuration

Populate `.env` in the root of the repo:

```
AWS_SNS_TOPIC_ARN_PREFIX=arn:aws:sns:us-east-1:11111111:slack-events-
SLACK_APP_VERIFICATION_TOKEN=token
SLACK_MACHINE_USER_NAME=mybot
```

## Creating and updating the endpoint

```
claudia create --name my-slack-endpoint --region us-east-1 --api-module index
```

[Claudia][claudia] will print out the endpoint base URL. Append `/messages` to
the end and provide it to Slack in the "Event Subscriptions" section of your app
configuration.

Update the endpoint with:

```
claudia update
```

## Enabling commands

This endpoint expects to receive messages in a specific format (where `bot-name`
is configured as `SLACK_MACHINE_USER_NAME` in `.env`):

```
bot-name verb command
```

or

```
@bot-name verb command
```

Any messages not matching that format will be ignored.

Add your verb to the `supportedBotVerbs` array in `src/process-message` and
create a corresponding SNS topic. If your `AWS_SNS_TOPIC_ARN_PREFIX` is
`arn:aws:sns:us-east-1:11111111:slack-events-` and your verb is `ping`, then the
ARN of the SNS topic you create should be:

```
arn:aws:sns:us-east-1:11111111:slack-events-ping
```

Some additional information related to the parsed command will be added to the
event, and the result is published to the SNS topic.

## That's it?

That's it. But now you can write any number of Lambda functions or other code
that subscribes to those SNS topics.

[events-api]: https://api.slack.com/events-api
[challenge]: https://api.slack.com/events/url_verification
[app-config]: https://api.slack.com/slack-apps
[claudia]: https://claudiajs.com
