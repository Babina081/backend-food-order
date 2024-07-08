const mongoose = require("mongoose");
const menuItemListSchema = mongoose.Schema({
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
  },
});

//Note: changed Model to model to fix issue
exports.MenuItemLists = mongoose.model("MenuItemLists", menuItemListSchema);
