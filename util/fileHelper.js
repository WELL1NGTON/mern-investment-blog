const fs = require("fs");
const sharp = require("sharp");

exports.compressImage = (file, size) => {
  const newPath = file.path.split(".")[0] + ".png";
  return sharp(file.path)
    .resize(size)
    .toFormat("png")
    .png
    // ({
    //   quality: 100,
    // })
    ()
    .toBuffer()
    .then((data) => {
      fs.access(file.path, (err) => {
        if (!err) {
          console.log(file.path);
          fs.unlink(file.path, (err) => {
            if (err) console.log(err);
          });
        } else {
          console.log(err);
        }
        fs.writeFile(newPath, data, (err) => {
          if (err) {
            throw err;
          }
        });
      });

      return newPath;
    });
};
