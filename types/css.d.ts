/**
 * TypeScript declaration for CSS side-effect imports.
 *
 * Imports like `import './index.css'` are handled by the esbuild renderer build
 * at build time; this declaration only exists so TypeScript (6.0+ checks
 * side-effect imports) accepts them.
 *
 * @see https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules
 */
declare module '*.css';
