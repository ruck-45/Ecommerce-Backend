const { executeQuery } = require("../utils/database");
const { getItemByIdQuery, createItemQuery, updateItemQuery, deleteItemQuery } = require("../constants/queries");

const genItemsId = (counter) => {
  const currentDate = new Date();
  const timestampComponent = currentDate.toISOString().slice(0, 19).replace(/[-:T]/g, "");

  // Random component (6 digits)
  const randomComponent = Math.floor(Math.random() * 300000)
    .toString()
    .padStart(6, "0");

  // Counter Component - Resets every Day
  const counterComponent = counter.toString().padStart(5, "0");

  // UserId
  const itemId = timestampComponent + randomComponent + counterComponent;

  return itemId;
};

const getItems = async (req, res) => {
  const start = parseInt(req.query.start, 10) || 0;
  const end = parseInt(req.query.end, 10) || 16;
  const colorFilter = req.query.color;
  const categoryFilter = req.query.category;
  const otherFilter = req.query.filter;
  const searchQuery = req.query.search;

  let getItemsQuery = `SELECT * FROM items WHERE 1=1`;
  let countQuery = "SELECT COUNT(*) AS totalItems FROM items WHERE 1=1";

  if (searchQuery) {
    getItemsQuery += ` AND (brand LIKE '%${searchQuery}%' OR title LIKE '%${searchQuery}%' OR topLevelCategory LIKE '%${searchQuery}%')`;
    countQuery += ` AND (brand LIKE '%${searchQuery}%' OR title LIKE '%${searchQuery}%' OR topLevelCategory LIKE '%${searchQuery}%')`;
  }

  if (colorFilter && colorFilter !== "all") {
    getItemsQuery += ` AND color LIKE '%${colorFilter}%'`;
    countQuery += ` AND color LIKE '%${colorFilter}%'`;
  }

  if (categoryFilter && categoryFilter !== "all") {
    getItemsQuery += ` AND (topLevelCategory LIKE '%${categoryFilter}%' OR secondLevelCategory LIKE '%${categoryFilter}%' OR thirdLevelCategory LIKE '%${categoryFilter}%')`;
    countQuery += ` AND (topLevelCategory LIKE '%${categoryFilter}%' OR secondLevelCategory LIKE '%${categoryFilter}%' OR thirdLevelCategory LIKE '%${categoryFilter}%')`;
  }

  // Ensure only one ORDER BY clause is applied; priority: newArrival, popular, then priceSort
  if (otherFilter === "new-arrivals") {
    getItemsQuery += ` ORDER BY created_at DESC`;
  } else if (otherFilter === "popular") {
    getItemsQuery += ` ORDER BY orders DESC`;
  } else if (otherFilter === "high-to-low") {
    getItemsQuery += ` ORDER BY discountedPrice DESC`;
  } else if (otherFilter === "low-to-high") {
    getItemsQuery += ` ORDER BY discountedPrice ASC`;
  } else if (otherFilter === "sale") {
    getItemsQuery += ` ORDER BY discountPercent DESC`;
  }

  getItemsQuery += ` LIMIT ${end} OFFSET ${start}`;
  const items = await executeQuery(getItemsQuery);
  if (!items.success) {
    return res.status(404).json({
      success: false,
      payload: { message: "Not Found", result: items.result },
    });
  }

  const totalItems = await executeQuery(countQuery);
  if (!totalItems.success) {
    return res.status(404).json({
      success: false,
      payload: { message: "Not Found", result: totalItems.result },
    });
  }

  const totalNumberOfItems = totalItems.result[0][0].totalItems;

  return res.status(200).json({
    success: true,
    payload: { message: "Items fetched successfully", result: items.result[0], total: totalNumberOfItems },
  });
};

const getItemById = async (req, res) => {
  const { itemId } = req.params;

  if (itemId === undefined) {
    return res.status(400).json({ success: false, payload: { message: "bad request" } });
  }

  const queryRes = await executeQuery(getItemByIdQuery, [itemId]);
  if (!queryRes.success) {
    return res
      .status(404)
      .json({ success: queryRes.success, payload: { message: "Item Not Found", result: queryRes.result } });
  }

  return res.status(200).json({ success: true, payload: { result: queryRes.result[0][0] } });
};

const createItem = async (req, res) => {
  const {
    brand,
    title,
    color,
    discountedPrice,
    price,
    discountPercent,
    highlights,
    details,
    quantity,
    material,
    dimension,
    description,
    topLevelCategory,
    secondLevelCategory,
    thirdLevelCategory,
    orders,
    registerCounter,
    imageCount,
  } = req.body;

  const minimumOrder = req.body.minimumOrder || 1; // Set minimumOrder to 1 if not provided
  const itemId = genItemsId(registerCounter);
  const values = [
    itemId,
    imageCount,
    brand,
    title,
    color,
    discountedPrice,
    price,
    discountPercent,
    JSON.stringify(highlights),
    details,
    quantity,
    material,
    dimension,
    description,
    topLevelCategory,
    secondLevelCategory,
    thirdLevelCategory,
    orders,
    minimumOrder,
  ];

  try {
    const item = await executeQuery(createItemQuery, values);
    if (!item.success) {
      return res.status(400).json({ success: false, payload: { message: "Failed to Create item" } });
    }
    return res.status(200).json({ success: true, payload: { message: "Item created successfully", itemId } });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, payload: { message: "Failed to create item", error: error.message } });
  }
};

const updateItem = async (req, res) => {
  const {
    item_id,
    brand,
    title,
    color,
    discountedPrice,
    price,
    discountPercent,
    highlights,
    details,
    quantity,
    material,
    dimension,
    description,
    topLevelCategory,
    secondLevelCategory,
    thirdLevelCategory,
    orders,
    minimumOrder,
    imageCount,
  } = req.body;

  const values = [
    brand,
    title,
    color,
    discountedPrice,
    price,
    discountPercent,
    JSON.stringify(highlights),
    details,
    quantity,
    material,
    dimension,
    description,
    topLevelCategory,
    secondLevelCategory,
    thirdLevelCategory,
    orders,
    minimumOrder,
    imageCount,
    item_id,
  ];

  try {
    const updateitem = await executeQuery(updateItemQuery, values);
    if (!updateitem.success) {
      return res.status(400).json({ success: false, payload: { message: "Failed to update item" } });
    }
    return res.status(200).json({ success: true, payload: { message: "Item updated successfully" } });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, payload: { message: "Failed to update item", error: error.message } });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.body;

  const item_id = id;

  try {
    const queryRes = await executeQuery(deleteItemQuery, [item_id]);
    if (!queryRes.success) {
      return res.status(400).json({ success: false, payload: { message: "Failed to delete item" } });
    }
    return res.status(200).json({ success: true, payload: { message: "Item deleted successfully" } });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, payload: { message: "Failed to delete item", error: error.message } });
  }
};

const uploadItemImages = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ success: false, payload: { message: "Image Upload Failed" } });
  }
  return res.status(200).json({ success: true, payload: { message: "Image Uploaded Successfully" } });
};

module.exports = { genItemsId, getItems, getItemById, createItem, updateItem, deleteItem, uploadItemImages };
