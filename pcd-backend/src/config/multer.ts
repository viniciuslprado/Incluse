import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { mkdirSync } from 'fs';

export default {
  upload: (folder = 'tmp') => {
    // ensure target directory exists
    const dir = resolve(__dirname, '..', folder);
    try {
      mkdirSync(dir, { recursive: true });
    } catch (e) {
      // ignore errors creating the directory
    }

    return {
      storage: diskStorage({
        destination: dir,
        filename: (_req, file, cb) => {
          const timestamp = Date.now();
          const unique = `${timestamp}-${Math.round(Math.random() * 1e9)}`;
          const name = file.originalname.replace(/\s+/g, '_');
          cb(null, `${unique}-${name}`);
        },
      }),
    };
  },
};
