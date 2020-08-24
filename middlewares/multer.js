const multer = require("multer");
const MINE_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/**
 * création d'objet de configuration de multer
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //destination pour explique ou enregistrer les fichiers
    callback(null, "public/images"); // null pour dire qu'il n ya pas eu d'erreurs
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MINE_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("picture");
