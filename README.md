# electron-simple-template

This is the easiest way to star an Electron app with React and Typescript.  
This template is focused on Windows + vscode users but can be adapted to youre needs.  
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

## Recomended tools

This template is preconfigured to use Eslint, Prettier and Stylelint.  
If you are a vscode user, you should install those plugins. Otherwise you can use them through the CLI.

## Getting started

1. Install Node and Git.
2. Clone this repo and `npm install`.
3. Update the **package.json** and the **electron-builder.json** with youre information.
4. (optional) Install vscode plugins [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint).

That's All. Now you can start focus on developing youre app. Enjoy !

### Package.json - Scripts

- `start` - Launch the Electron app in Development mode. Esbuild will build youre files and Node will watch for changes.
- `build:prod` - When youre app is ready, use this script to build youre sources for production.
- `build:dev` - Will build youre sources in development mode ( Sourcemaps on, Watcher off).
- `electron` - Start the electron app. You need to have youre sources builts or an error will show. You have to use it after `build:prod` or `build:dev`.
- `lint:*` - Will run Eslint via the CLI.
- `format:*` - Will run Prettier via the CLI.
- `styles:*` - Will run Stylelint via the CLI.
- `dist:*` - Will create package for specific OS.

> Remember that to create a package, you must run the command on a related operating system. That is, if you are going to create a package for Windows, you must run that command from a Windows computer.  
> The first time you run a **dist** script, run it in a terminal with administrator privilege.

### Debugging

> If you are a Linux or Mac user you will probably need to adapt the launch.json.

This project is configured to work in vscode and windows. If you use another OS os IDE you will probably need to adapt the debug configuration.

Add breakpoints in vscode.  
Open the debug tab and select one of the following option:

- **Electron app** - All breakpoints will work ( main, preload and renderer).
  > If you pause too much time in a breakpoint on the main process, the renderer debug process will fail. This is a normal behavior.
- **Main process only** - Only breakpoints in main process will work.
- **watcher config file** - Let you debug the Node watcher configuration file.
- **clean and esbuild config file** - Let you debug the esbuild and clean configuration file.
