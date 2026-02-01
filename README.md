# electron-simple-template

This is the easiest way to star an Electron app with React and Typescript.  
This template is focused on Windows + vscode users but can be adapted to your needs.  
Just download and start developing. Everything is already configured.

## Features

- Free and open source.
- Low dependencies.
- Easy to maintain.
- Integrated linter scaffolding.
- Integrated formater scaffolding.
- Integrated vscode debugger configuration.
- Typescript ready.
- React ready.

## Why this template ?

Every time I've used a tool to create an Electron application ( like Vite, Electron Forge or Electron Vite), it added a lot of boilerplate and complex configurations difficult to understand and maintain.  
Many times I found myself in the situation that despite having the project just created, there were already dependencies marked as obsolete since the tools that were underneath were not updated at the same rate as Electron.  
Also, none of those tools initialized the project with a basic system of linting, formatting and debugging.  
Tools like Vite are wonderful but today they are oriented to the frontend. However, an Electron application contains 3 entry points (main, preload and renderer) with 3 different behaviors (node and esm). This makes it really complex to configure Vite or other similar tools and make them work properly.  
So I decided to create my own light, simple and easy to use template. That allows me to develop my application directly without wasting time configuring the same thing over and over again.

## Recommended tools

This template is pre-configured to use Eslint, Prettier and Stylelint.  
If you are a vscode user, it is optional but recommended to install those plugins.
You can use them through the CLI.

## Getting started

1. Install Node and Git.
2. Clone this repo and `npm install`.
3. Update the **package.json**, the **electron-builder.json** and other files ( like the contributing, license, etc) with your information. ( if you don´t update the **package.json** you will have problems running the app.)
   - In the **package.json** search for "yourenamehere" and change it for your app name.
4. Update / modify the **AGENTS.md** to fit your project requirements.
5. (optional) Install vscode plugins [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint).

That's All. Now you can start focus on developing your app. Enjoy !

### Package.json - Scripts

- `start:dev` - Launch the Electron app in Development mode. Esbuild will build your files and Node will watch for changes.
- `start:prod` - Launch the Electron app in Production mode. Esbuild will build your files for production. Watch is deactivated.
- `start:debug` - Launch the Electron app in debug mode with a specific port. This script is used by the launch.json.
- `build:prod` - When your app is ready, use this script to build your sources for production.
- `build:dev` - Will build your sources in development mode (with sourcemaps and other configurations).
- `watch` - Will only watch for file changes.
- `watch:electron` - Will watch for file changes and will relaunch the electron app every time a change happen.
- `clean` - this scripts delete the dist folder. Useful if you want to be sure that no old files still in use after rebuild.
- `electron` - Only start the electron app. Electron will search for the path in the `main` property in the package.json so you need to have your sources builts or an error will show. You have to use it after `build:prod` or `build:dev`.
- `electron:debug` - Launch the electron app with a specific port to enable debug in vscode.
- `lint:*` - Will run Eslint via the CLI. Check will search for error, and fix will try to automagically fix them.
- `format:*` - Will run Prettier via the CLI. Check will search for error, and fix will try to automagically fix them.
- `styles:*` - Will run Stylelint via the CLI. Check will search for error, and fix will try to automagically fix them.
- `dist:*` - Will create package for specific OS.

> Remember that to create a package, you must run the command on a related operating system. That is, if you are going to create a package for Windows, you must run that command from a Windows computer.  
> The first time you run a **dist** script, run it in a terminal with administrator privilege.

### Runing your app

To develop your application, you can run the application in several ways. Below I recommend 2 that I find most practical:

1. Just use the `start:dev` script. This will start your app. Every time you make a change and save, it will close the app and automatically reopen it with the new changes. You will be able to debug just the React part from the Devtools
2. (**Recommended**) Open the vscode debug window and select `Electron app`. That will start the app. When you modify your code, the sources will be rebuilt, but to see the changes you will need to press `Restart` in the debug options bar. The nice thing about this option is that any breakpoint you have put in your code will work. Be it main, preload, render or even configuration files.

### Debugging

This project is configured to work in vscode and windows. If you use another OS os IDE you will probably need to adapt the debug configuration.

Add breakpoints in vscode.  
Open the debug tab and select one of the following option:

- **Electron app** - All breakpoints will work ( main, preload and renderer).
  > If you pause too much time in a breakpoint on the main process, the renderer debug process will fail. This is a normal behavior.
- **Main process only** - Only breakpoints in main process will work.
- **watcher config file** - Let you debug the Node watcher configuration file.
- **clean and esbuild config file** - Let you debug the esbuild and clean configuration file.

If you want to ddebug the renderer you can do it in the devtools running your app normally, or adding breakpoints in vscode and runing the app by using the `Electron app` debug configuration.

## Code of conduct

This project has adopted a Code of Conduct that we expect project participants to adhere to. Please read the [full text](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Contributing guide

Read our [contributing document](./CONTRIBUTING.md) to learn how to help or report a bug in this project.

## License

This project [licence](./LICENSE) is MIT.
