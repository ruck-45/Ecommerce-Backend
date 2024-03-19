const { executeQuery } = require("../utils/database");
const { getItemsQuery, getItemByIdQuery } = require("../constants/queries");

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

  if (start >= end) {
    return res.status(400).json({ success: false, payload: { message: "Bad Request" } });
  }

  const items = await executeQuery(getItemsQuery, [end - start, start]);
  if (!items.success) {
    return res.status(404).json({
      success: items.success,
      payload: { message: "Not Found", result: items.result },
    });
  }

  return res.status(200).json({
    success: true,
    payload: { result: items.result[0] },
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

  return res.status(200).json({ success: true, payload: { result: queryRes.result[0][0]} });
};

module.exports = { genItemsId, getItems, getItemById };