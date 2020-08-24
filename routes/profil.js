var express = require("express");
var router = express.Router();

/*route for users infos*/
const profilController = require("../controllers/profil");
const authentification = require("../middlewares/authentif");

/* POST profil register. */
router.post("/register", profilController.register);

/*POST profil data.*/
router.post("/dataProfil", authentification, profilController.dataProfil);

/* POST profil login. */
router.post("/login", profilController.login);

/* PUT profil edit.*/
router.put("/edit", authentification, profilController.edit);

/* DELETE profil delete.*/
router.delete("/delete", authentification, profilController.delete);

module.exports = router;
