const { executeQuery } = require("../utils/database");
const { getItemByIdQuery } = require("../constants/queries");

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

// const getItems = async (req, res) => {
//   const start = parseInt(req.query.start, 10) || 0;
//   const end = parseInt(req.query.end, 10) || 16;

//   if (start >= end) {
//     return res.status(400).json({ success: false, payload: { message: "Bad Request" } });
//   }

//   const items = await executeQuery(getItemsQuery, [end - start, start]);
//   if (!items.success) {
//     return res.status(404).json({
//       success: items.success,
//       payload: { message: "Not Found", result: items.result },
//     });
//   }

//   return res.status(200).json({
//     success: true,
//     payload: { result: items.result[0] },
//   });
// };

const getItems = async (req, res) => {
  const start = parseInt(req.query.start, 10) || 0;
  const end = parseInt(req.query.end, 10) || 16;
  const colorFilter = req.query.color;
  const newArrivalFilter = req.query.newArrival === "true";
  const popularFilter = req.query.popular === "true";
  const categoryFilter = req.query.category;
  const priceSortFilter = req.query.priceSort;
  const saleFilter = req.query.sale;

  if (start >= end) {
    return res.status(400).json({ success: false, payload: { message: "Bad Request" } });
  }

  let getItemsQuery = `SELECT * FROM items WHERE 1=1`;
  let countQuery = "SELECT COUNT(*) AS totalItems FROM items WHERE 1=1";

  if (colorFilter && colorFilter !== "All") {
    getItemsQuery += ` AND color LIKE '%${colorFilter}%'`;
    countQuery += ` AND color LIKE '%${colorFilter}%'`;
  }

  if (categoryFilter && categoryFilter !== "All") {
    getItemsQuery += ` AND (topLevelCategory LIKE '%${categoryFilter}%' OR secondLevelCategory LIKE '%${categoryFilter}%' OR thirdLevelCategory LIKE '%${categoryFilter}%')`;
    countQuery += ` AND (topLevelCategory LIKE '%${categoryFilter}%' OR secondLevelCategory LIKE '%${categoryFilter}%' OR thirdLevelCategory LIKE '%${categoryFilter}%')`;
  }

  // Ensure only one ORDER BY clause is applied; priority: newArrival, popular, then priceSort
  if (newArrivalFilter) {
    getItemsQuery += ` ORDER BY created_at DESC`;
  } else if (popularFilter) {
    getItemsQuery += ` ORDER BY orders DESC`;
  } else if (priceSortFilter === "highToLow") {
    getItemsQuery += ` ORDER BY discountedPrice DESC`;
  } else if (priceSortFilter === "lowToHigh") {
    getItemsQuery += ` ORDER BY discountedPrice ASC`;
  } else if (saleFilter) {
    getItemsQuery += ` ORDER BY discountPercent DESC`;
  }

  // Apply pagination
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

  const totalNumberOfItems = totalItems.result[0].totalItems;
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

module.exports = { genItemsId, getItems, getItemById };
