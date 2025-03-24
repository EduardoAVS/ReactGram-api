import multer from "multer";
import path from "path";

// Configuração do armazenamento de imagens
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = "";

        if (req.baseUrl.includes("users")) {
            folder = "users";
        } else if (req.baseUrl.includes("photos")) {
            folder = "photos";
        }

        cb(null, `uploads/${folder}/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nomeia o arquivo com timestamp
    }
});

const imageUpload = multer({ storage: imageStorage , fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
        // Permite apenas png e jpg
        return cb(new Error("Por favor, envie apenas png ou jpeg"))
    }
    cb(null, true);
}});

export default imageUpload;
