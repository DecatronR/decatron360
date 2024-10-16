module.exports = {
  rules: {
    "no-global-css-import": {
      create(context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value.endsWith(".css")) {
              context.report({
                node,
                message:
                  "Do not import global CSS files here, move them to `_app.js` or `layout.js`.",
              });
            }
          },
        };
      },
    },
  },
};
