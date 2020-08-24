const Product = require("../model/Product");
const Profil = require("../model/Profil");

const productController = {
  //enregistrement du product dans la base de donnée
  productCreate: (req, res) => {
    console.log(req.file.path);

    const filePath = req.file.path.replace("public", "");

    const newProduct = new Product({
      category: req.body.category,
      travel_name: req.body.travel_name,
      short_description: req.body.short_description,
      long_description: req.body.long_description,
      main_picture: req.body.main_picture,
      picture: [{ original: filePath, thumbnail: filePath }],

      price: req.body.price,
    });
    newProduct.save((err) => {
      if (err) {
        console.log(err);
        res.json({ message: "an error" });
      } else {
        res.json({ message: "produit enregistre" });
      }
    });
  },
  getProduct: (req, res) => {
    Product.find({}, (err, data) => {
      if (err) {
        res.status(500).send("error produite");
        return;
      }
      res.json(data);
    }).limit(4);
  },
  categoryProduct: (req, res) => {
    const categoryName = req.params.category;
    Product.find({ category: categoryName }, (err, data) => {
      if (err) {
        res.status(500).send("erreur");
        return;
      }
      res.json(data);
    });
  },

  /*Affiche la fiche produit*/
  product: (req, res, next) => {
    const productName = req.params.product;
    Product.findOne({ travel_name: productName }, (err, data) => {
      if (err) {
        res.status(500).send("Il y a une erreur");
      }
      res.json(data);
    });
  },

  /*Valide la réservation*/
  reservation: (req, res, next) => {
    Profil.updateOne(
      { _id: req.user._id },
      {
        $push: {
          order: {
            travel_name: req.body.travel_name,
            travellers_number: req.body.travellers_number,
            total_price: req.body.total_price,
            travel_date: req.body.travel_date,
          },
        },
      },
      (err) => {
        if (err) {
          console.log(err);
          res.json({ message: "tu as fait des bétises" });
        } else {
          res.json({
            message:
              "Merci pour votre réservation. Nous reviendrons vers vous pour les détails du séjour.",
          });
        }
      }
    );
  },

  /*Affiche les 2 derniers produits*/
  more: (req, res, next) => {
    const productInfo = req.params.product;
    const categoryInfo = req.params.category;

    Product.find({
      travel_name: { $ne: productInfo },
      category: categoryInfo,
    })
      .limit(2)
      .exec((err, data) => {
        res.json(data);
      });
  },
};

module.exports = productController;
