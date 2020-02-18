# e-Potek's Front Plugin

This plugin helps us be productive in our email client by adding contextual data inside our emails.

## Development

To work on the plugin, follow these steps:

1. Start the backend microservice to serve the plugin as a static asset
2. Open a ngrok tunnel to your backend by running `npm run script -- ngrok` inside the backend directory
3. Start webpack in watch mode by running `npm run build-watch` in the frontPlugin directory
4. Create/Update your front dev plugin in Front's `Settings/Plugins & API`
   1. Set the new URL from ngrok
   2. Update the DEV_AUTH_TOKEN if needed
5. Reload Front to get the latest version of your plugin! :)