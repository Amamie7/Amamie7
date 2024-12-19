import fs from 'fs';

const deleteLocalFile = (file, req) => {
  const basePath = `${req.protocol}://${req.get('host')}`;
  const localFilePath = file.replace(basePath, "./");
  if (fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }
};

export default deleteLocalFile;
