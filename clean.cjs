// This script delete the specified output folders

const fs = require('fs');
const path = require('path');

const deleteFolderRecursive = function (directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};
// Add to the following array the folders you want to be automatically deleted
['dist', 'release'].forEach((dir) => {
  deleteFolderRecursive(path.join(__dirname, dir));
});
