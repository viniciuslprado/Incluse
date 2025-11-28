import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Diretório para laudos médicos
const laudoDir = path.join(path.dirname(path.fileURLToPath(import.meta.url)), '..', '..', 'uploads', 'laudos');
if (!fs.existsSync(laudoDir)) {
  fs.mkdirSync(laudoDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, laudoDir);
  },
  filename: (req, file, cb) => {
    const candidatoId = (req as any).user?.id;
    const timestamp = Date.now();
    cb(null, `laudo-${candidatoId}-${timestamp}.pdf`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos PDF são permitidos para laudo médico'));
  }
};

export const uploadLaudo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});
