const Category = require("../database/models/categoryModel");

module.exports.createCategory = async (serviceData) => {
  try {
    const newCategory = new Category({
      name: serviceData.name,
    });

    let result = await newCategory.save();

    return result.toObject();
  } catch (error) {
    console.error("Error in categoryService.js", error);
    throw new Error(error);
  }
};

module.exports.getCategories = async () => {
  try {
    const categories = await Category.find({});
    if (!categories) throw new Error("Categories not found!");

    return categories.map((category) => category.toObject());
  } catch (error) {
    console.error("Error in categoryService.js", error);
    throw new Error(error);
  }
};
