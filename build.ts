/**
 * Remove old files, copy front-end ones.
 */

import Logger from "jet-logger";
import fs from "fs-extra";

try {
  // Remove current build
  fs.removeSync("./dist/");
  // Copy front-end files
  fs.copySync("./src/client/build", "./dist/client");
  // fs.copySync('./src/public', './dist/public');
  // fs.copySync('./src/views', './dist/views');
} catch (err) {
  Logger.Err(err);
}
