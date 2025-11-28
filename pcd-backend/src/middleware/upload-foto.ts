import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Diretório para fotos de perfil
const fotoDir = path.join(path.dirname(path.fileURLToPath(import.meta.url)), '..', '..', 'uploads', 'fotos');
if (!fs.existsSync(fotoDir)) {
  fs.mkdirSync(fotoDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fotoDir);
  },
  filename: (req, file, cb) => {
    const candidatoId = (req as any).user?.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `foto-${candidatoId}-${timestamp}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas para foto de perfil'));
  }
};

export const uploadFoto = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});
