const mongoose = require("mongoose");

/*User schema pour template produit*/

const productSchema = new mongoose.Schema(
  {
    category: String,
    travel_name: String,
    short_description: String,
    long_description: String,
    main_picture: String,
    picture: [{ original: String, thumbnail: String }],
    price: Number,
    dates: [{ dates: String }],
  },
  {
    collection: "products",
  }
);

module.exports = mongoose.model("Product", productSchema);
