// Middlewares\SetUploadsfilePathHandler.js
import fs from 'fs';

const SetuploadfilePathhandler = (req, dir) => {
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }
    req.headers.targetFilepath = dir;
    return dir;
};

export default SetuploadfilePathhandler;