import path from 'path';

import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '../../uploads');
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const limits = {
	fileSize: 10 * 1000000, // 10mb
};

const upload = multer({
	storage,
	limits,
	fileFilter: (req, file, cb) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
			return cb(new Error(`${file.mimetype} is not an accepted image format.`));
		}

		cb(null, true);
	},
});

export default upload;
