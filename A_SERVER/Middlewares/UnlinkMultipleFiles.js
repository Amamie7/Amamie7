import fs from 'fs';

const deleteLocalFiles = (filesArray, req) => {
  filesArray.forEach((fileObj) => {
    const basePath = `${req.protocol}://${req.get('host')}`;
    const localFilePath = fileObj.filePath.replace(basePath, "./");
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  });
};

export default deleteLocalFiles;
