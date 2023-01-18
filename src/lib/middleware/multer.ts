import multer from "multer";
import { randomUUID } from "node:crypto";
import mime from "mime";

// AGGIUNGE L'ESTENSIONE ALL'IMMAGINE
export const generatePhotoFilename = (mimeType: string) => {
    const randomFilename = `${randomUUID()}-${Date.now()}`;
    const fileExtension = mime.getExtension(mimeType);
    const filename = `${randomFilename}.${fileExtension}`;

    return filename;
};

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (request, file, callback) => {
        return callback(null, generatePhotoFilename(file.mimetype));
    },
});

export const multerOptions = {};

export const initMulterMiddleware = () => {
    return multer({ storage, ...multerOptions });
};
