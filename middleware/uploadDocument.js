import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Создаем директорию для загрузок, если её нет
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Разрешаем PDF, DOC, DOCX и изображения
  const fileExt = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const extname = allowedExtensions.includes(fileExt);
  
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  const mimetype = allowedMimes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(`Разрешены только файлы: PDF, DOC, DOCX, изображения. Получен: ${file.mimetype || fileExt}`));
  }
};

export const uploadDocument = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB для документов
  },
  fileFilter: fileFilter
});

