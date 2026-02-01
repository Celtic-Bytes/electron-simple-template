/**
 * TypeScript Module Declarations for Image Assets
 *
 * TypeScript only understands code files (.ts, .tsx, .js) by default. When you
 * try to import a non-code file like an image, TypeScript has no idea what that
 * file is or what type the import should have, resulting in errors like:
 *
 *   "Cannot find module './icon.png' or its corresponding type declarations"
 *
 * These `declare module` statements tell TypeScript: "Trust me, files matching
 * this pattern exist and their default export is a string." The bundler (esbuild)
 * handles the actual file at build time, converting it to a path or data URL.
 *
 * @see https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules
 */

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}
