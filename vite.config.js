export default {
    esbuild: {
        jsxFactory: 'DOMcreateElement',
        jsxFragment: 'DOMcreateFragment',
        jsxInject: `import { DOMcreateElement, DOMcreateFragment } from 'src/dom/renderer';`,
    },
    resolve: {
        alias: {
            src: "/src"
        },
    },
};
