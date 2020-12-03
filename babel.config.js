module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@modules": "./src/modules/",
          "@config": "./src/config/",
          "@shared": "./src/shared/",
          // "@config": "./src/config",
          // "@models": "./src/models",
          // "@controllers": "./src/controllers",
          // "@views": "./src/views",
        },
      },
    ],
  ],
  ignore: ["**/*.spec.ts"],
};
