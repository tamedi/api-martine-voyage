/* Imports */
const Profil = require("../model/Profil");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* Controller to register; get data of profil; login; edit and delete profl*/
const profilController = {
  register: (req, res, next) => {
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    /*stockage d'un mot de passe crypté dans la base de données apres le req*/
    const hash = bcrypt.hashSync(req.body.password, 10);

    if (
      typeof req.body.firstname != "string" ||
      typeof req.body.lastname != "string" ||
      typeof req.body.tel != "string" ||
      /*check de format de saisie de l'email avec RegExp*/
      cacahuete.test(email) == false ||
      typeof req.body.password != "string" ||
      (req.body.hobbies && typeof req.body.hobbies != "string")
    ) {
      res.status(417);
      res.json({
        message:
          "Veuillez compléter les champs obligatoires et respecter le format de saisie.",
      });
    } else {
      const newProfil = new Profil({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        tel: req.body.tel,
        email: req.body.email,
        password: hash /*mdp hashé*/,
        hobbies: req.body.hobbies,
      });

      /*sauvegarde du nouveau profil*/
      newProfil.save((err) => {
        if (err) {
          console.log(err);
          res.json({
            message:
              "L'e-mail saisi est déja lié à un compte. Veuillez vous connecter ou saisir une autre adresse mail.",
          });
        } else {
          res.json({
            message: "Votre inscription a bien été prise en compte. Merci.",
          });
        }
      });
    }
  },

  dataProfil: (req, res, next) => {
    delete req.user.password; /*permet de ne pas afficher le password crypté*/
    res.json(req.user); /*on request sous format json les données du user */
  },

  login: (req, res, next) => {
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    console.log(req.body);

    if (
      cacahuete.test(email) == false ||
      typeof req.body.password != "string" /**check des formats emails et pwd */
    ) {
      res.status(417);
      res.json({
        message:
          "Saisie incorrects. Veuillez ressaisir vos identifiants et mot de passe.",
      });
    } else {
      /*comparaison email user et base de donnée si match ou pas */
      Profil.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "une erreur s'est produite",
          }); /*erreur de saisie ou autre err*/
        } else if (!data) {
          res.status(401).json({
            message:
              "Identifiant de connexion incorrect." /*donnée ne matche pas avec database*/,
          });
        } else {
          /* quand utilisateur enfin ok => comparaison password avec bcrypt */
          bcrypt.compare(req.body.password, data.password, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).json({
                message: "Une erreur s'est produite.",
              }); /*erreur de saisie ou autre err*/
            } else if (!result) {
              res.status(401).json({
                message:
                  "Mot de passe incorrect." /*password ne matche pas avec database*/,
              });
            } else {
              res.status(200).json({
                userId: data._id,
                token: jwt.sign({ userId: data._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                  /*durée de validité du Token, l'utilisateur devra se reconnecter au bout de 24h*/
                }),
                message: "Connexion Réussie !" /*good password */,
              });
            }
          });
        }
      });
    }
  },

  edit: (req, res, next) => {
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.profil.email;
    if (
      typeof req.body.profil.firstname != "string" ||
      typeof req.body.profil.lastname != "string" ||
      typeof req.body.profil.tel != "string" ||
      cacahuete.test(email) == false ||
      /*typeof req.body.password != "string" ||*/
      (req.body.profil.hobbies && typeof req.body.profil.hobbies != "string")
    ) {
      res.status(417);
      res.json({
        message:
          "Veuillez compléter les champs au bon format pour confirmer la modification de votre compte.",
      });
    } else {
      Profil.updateOne(
        /*Modif et mise à jour des données l'user repéré grace a son id */
        {
          _id: req.user._id,
        },
        {
          firstname: req.body.profil.firstname,
          lastname: req.body.profil.lastname,
          tel: req.body.profil.tel,
          email: req.body.profil.email,
          hobbies: req.body.profil.hobbies,
        },
        (err) => {
          if (err) {
            console.log(err);
            res.json({ message: "une erreur s'est produite" });
          } else {
            res.json({
              message:
                "Vos modifications ont bien été prises en compte. Merci.",
            });
          }
        }
      );
    }
  },

  delete: (req, res, next) => {
    Profil.deleteOne(
      {
        _id: req.user._id,
      },
      (err) => {
        if (err) {
          console.log(err);
          res.json({ message: "une erreur s'est produite" });
        } else {
          res.json({
            message:
              "La suppression de votre compte a bien été prise en compte. Merci.",
          });
        }
      }
    );
  },
};

/* Export */

module.exports = profilController;
