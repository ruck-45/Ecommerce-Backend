const { executeQuery } = require("../utils/database");
const {
  getBlogsQuery,
  getBlogByIdQuery,
  initializeBlog,
  initializeBlogContent,
  getTotalBlogsQuery,
} = require("../constants/queries");

// ********************************** Util Functions ***********************************************

const genBlogid = (counter) => {
  // Timestamp component (YYYYMMDDHHMMSS)
  const currentDate = new Date();
  const timestampComponent = currentDate.toISOString().slice(0, 19).replace(/[-:T]/g, "");

  // Random component (6 digits)
  const randomComponent = Math.floor(Math.random() * 300000)
    .toString()
    .padStart(6, "0");

  // Counter Component - Resets every Day
  const counterComponent = counter.toString().padStart(5, "0");

  // UserId
  const blogId = timestampComponent + randomComponent + counterComponent;

  return blogId;
};

// ********************************** Blog ***********************************************

const createBlog = async (req, res) => {
  const { title, summary, content, blogCounter } = req.body;
  const userId = req.user.user_id;

  if (title === undefined || summary === undefined || content === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  if (title.length > 100 || summary.length > 260) {
    return res.status(406).json({ success: false, payload: { message: "Not Acceptable. Data Length Exceeds Limit" } });
  }

  const blogId = genBlogid(blogCounter);
  const imageId = genBlogid(blogCounter);
  const blogDetails = [blogId, title, summary, imageId, userId];
  const queryRes1 = await executeQuery(initializeBlog, blogDetails);

  // Return If Creation Unsuccessful
  if (!queryRes1.success) {
    return res.status(501).json({ success: queryRes1.success, payload: queryRes1.result });
  }

  const queryRes2 = await executeQuery(initializeBlogContent, [blogId, content, imageId]);
  if (!queryRes2.success) {
    return res.status(501).json({ success: queryRes2.success, payload: queryRes2.result });
  }

  return res.status(201).json({ success: true, payload: { message: "Blog Creation Successful", imageId } });
};

const getBlogById = async (req, res) => {
  const { blogId } = req.params;

  if (blogId === undefined) {
    return res.status(400).json({ success: false, payload: { message: "bad request" } });
  }

  const queryRes = await executeQuery(getBlogByIdQuery, [blogId]);
  if (!queryRes.success) {
    return res
      .status(404)
      .json({ success: queryRes.success, payload: { message: "Blog Not Found", result: queryRes.result } });
  }

  return res.status(200).json({ success: true, payload: { result: queryRes.result[0][0].content } });
};

const getBlogs = async (req, res) => {
  const start = parseInt(req.query.start, 10) || 0;
  const end = parseInt(req.query.end, 10) || 8;

  if (start >= end) {
    return res.status(400).json({ success: false, payload: { message: "Bad Request" } });
  }

  const queryRes = await executeQuery(getBlogsQuery, [end - start, start]);
  if (!queryRes.success) {
    return res.status(404).json({
      success: queryRes.success,
      payload: { message: "Not Found", result: queryRes.result },
    });
  }

  const blogs = await executeQuery(getTotalBlogsQuery);
  if (!blogs.success) {
    return res.status(404).json({
      success: blogs.success,
      payload: { message: "Not Found", result: blogs.result },
    });
  }

  const totalNumberOfBlogs = blogs.result[0][0].totalBlogs;

  return res.status(200).json({
    success: true,
    payload: { result: queryRes.result[0], total: totalNumberOfBlogs },
  });
};

const updateBlogImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, payload: { message: "Image Upload Failed" } });
  }

  return res.status(200).json({ success: true, payload: { message: "Image Uploaded Successfully" } });
};

module.exports = { genBlogid, createBlog, getBlogById, getBlogs, updateBlogImage };
