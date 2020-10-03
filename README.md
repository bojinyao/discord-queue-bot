# discord-queue-bot

A Discord Bot written in Typescript that manages Queues in text channels deployed on Heroku

## Table fo Contents

- [discord-queue-bot](#discord-queue-bot)
  - [Table fo Contents](#table-fo-contents)
  - [Set Up](#set-up)
    - [Requirements](#requirements)
    - [Installation](#installation)
    - [Create Bot on Discord and Deploy to Heroku](#create-bot-on-discord-and-deploy-to-heroku)
    - [Sync up with Google's Calendar API](#sync-up-with-googles-calendar-api)
  - [How to use and Configurations](#how-to-use-and-configurations)
    - [Update Secrets](#update-secrets)
    - [Configure the Bot](#configure-the-bot)
    - [(Optional) Configure Typescript Compiler](#optional-configure-typescript-compiler)
    - [Build and Run](#build-and-run)
  - [Additional Resources during development](#additional-resources-during-development)

## Set Up

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Heroku Account](http://heroku.com/)
- [Discord Account](https://discord.com/)
- A text editor that integrates Typescript; [VSCode](https://code.visualstudio.com/) recommended.

### Installation

You can get the latest code via cloning the repository:

```shell
git clone https://github.com/bojinyao/discord-queue-bot.git
```

or, you can use the download one of the [Releases](https://github.com/bojinyao/discord-queue-bot/releases)

1. After you have downloaded the code, `cd` into the directory in your terminal.
2. Run: `npm install` this will install all the dependencies.

To uninstall, simply delete the entire directory.

### Create Bot on Discord and Deploy to Heroku

[This](https://medium.com/@thomlom/how-to-create-a-discord-bot-under-15-minutes-fb2fd0083844) is a great article on how to create a Discord bot and deploy Nodejs Discord Bot project to Heroku.

Here is another [Guide on hosting on Heroku](https://anidiots.guide/hosting/heroku).

### Sync up with Google's Calendar API

To sync up to Google's Calendar API, you will need to create a new Google API project, and very importantly, create a **Service Account** for the Bot itself, and don't worry about *Consent Screen* that the API console keeps bugging you to create.

This [Medium Article on Google Calendar API](https://medium.com/@ArchTaqi/google-calendar-api-in-your-application-without-oauth-consent-screen-4fcc1f8eb380) is an excellent step-by-step guide on the process.

These are some official documentation that might be useful:

- [Google Calendar API](https://developers.google.com/calendar/auth)
- [Google Calendar API Reference](https://developers.google.com/calendar/v3/reference)

## How to use and Configurations

### Update Secrets

In order to run the bot locally, you need to create a `.env` file at the root of the project directory. The file will be used to keep secrets of the application.

**These values must be kept secrete!**

There are four required secretes to make the bot work correctly:

1. `BOT_TOKEN`: This is the token to your Discord bot
2. `SERVICE_ACCOUNT_PRIVATE_KEY_ID`: This is the `private_key_id` property from your Google API Service Account's JSON file.
3. `SERVICE_ACCOUNT_PRIVATE_KEY`: This is the `private_key` property from your Google API Service Account's JSON file.
4. `SERVICE_ACCOUNT_CLIENT_EMAIL`: This the `client_email` property from your Google API Service Account's JSON file.

You will also need to upload these four values to your Heroku project as `Config Vars`. **DO NOT Upload them to any public repository!**

### Configure the Bot

The file `bot-config.ts` contains (actual deployed) examples of configuration. You can find out more info about each property by checking out [types.d.ts](./src/types.d.ts) file that contains definitions of each property.

Don't worry too much about formatting, your editor should provide warnings if you did anything wrong, or the ts compiler will certainly let you know 🙂

### (Optional) Configure Typescript Compiler

If you need to configure the Typescript Compiler (tsc), you can do it by editing `tsconfig.json`.

### Build and Run

Once you've uploaded these secretes to Heroku, the Bot should start running. If you're hosting a local instance, run:

```shell
npm run dev # will spawn a ts-node instance and run ts files directly
```

If you'd like to compile the project to javascript and run these js instead, do:

```shell
% npm run build # transpile to javascript inside ./build
% npm start     # run index.js in ./build/src
```

## Additional Resources during development

- [Discord.js Documenation](https://discord.js.org/#/docs/main/stable/general/welcome)
- [Google API Examples 1](https://github.com/googleapis/google-api-nodejs-client/issues/1574)
- [Google API Examples 2](https://github.com/googleapis/google-auth-library-nodejs#json-web-tokens)
- [Deploy Typescript node to Heroku](https://stackoverflow.com/a/46140313)
