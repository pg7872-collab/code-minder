import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.originalname.toLowerCase().endsWith('.pdf')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF resume files (.pdf) are supported.'), false);
  }
};

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter,
});
