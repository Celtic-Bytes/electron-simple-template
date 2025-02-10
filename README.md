1. Create a folder and use `npm init` to create the `package.json`.
2. Add [typescript](https://www.typescriptlang.org/download/) and initialize with `tsc init`.
3. Install [React](https://react.dev/learn/add-react-to-an-existing-project) with `npm install react react-dom`.
4. Install [Esbuild](https://esbuild.github.io/getting-started/) with `npm install --save-exact --save-dev esbuild`.
5. Install [Electron](https://www.electronjs.org/docs/latest/tutorial/installation) with `npm install electron --save-dev`.
6. Install types:
    1. [node](https://github.com/DefinitelyTyped/DefinitelyTyped): `npm install --save-dev @types/node`.
    2. [react](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react): `npm install --save-dev @types/react`.
    3. [react-dom](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom): `npm install --save-dev @types/react-dom`.
7. Initiate Git with `git init` ( optional: renamle `master` to `main` with `git branch -m master main`).
8. Add a `.gitignore` file with the following content and create youre first commit:

    ```text
    # Logs
     logs
     *.log
     npm-debug.log*
     yarn-debug.log*
     yarn-error.log*
     pnpm-debug.log*
     lerna-debug.log*

     node_modules
     dist
     release
     *.local
     package-lock.json

     # Editor directories and files
     .vscode/*
     !.vscode/extensions.json
     !.vscode/launch.json
     .idea
     .DS_Store
     *.suo
     *.ntvs*
     *.njsproj
     *.sln
     *.sw?
    ```

    > If you copy and paste this text, remember to remove indentation in the git .gitignore file.

9.
