const { executeQuery } = require("../utils/database");
const {getBlogsQuery, getBlogByIdQuery, initializeBlog } = require("../constants/queries");



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
  const { title, description, employeeId, registerCounter } = req.body;

  if (title === undefined || description === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  if (title.length > 50) {
    return res.status(406).json({ success: false, payload: { message: "Not Acceptable. Data Length Exceeds Limit" } });
  }

  const blogId = genBlogid(registerCounter);
  const blogDetails = [blogId, title, description, employeeId];
  const qreryRes = await executeQuery(initializeBlog, blogDetails);

  // Return If Creation Unsuccessful
  if (!qreryRes.success) {
    return res.status(501).json({ success: qreryRes.success, payload: qreryRes.result });
  }


  return res
    .status(201)
    .json({ success: true, payload: { message: "Blog Creation Successful" } });

}


const getBlogById = async (req, res) => {
    const blogId = req.query['blog_id'];
    console.log(typeof blogId)
    console.log(blogId)
    const queryRes = await executeQuery(getBlogByIdQuery, [blogId]);
    console.log(queryRes);
    // Return If Query Unsuccessful
    if (!queryRes.success) {
      return res
        .status(404)
        .json({ success: queryRes.success, payload: { message: "Blog Not Found", result: queryRes.result } });
    }

    return res.status(200).json({ status: "success", payload: { result: queryRes.result[0] } });
}


const getBlogs = async (req, res) => {
    const queryRes = await executeQuery(getBlogsQuery)
    console.log(queryRes.result[0].length);
    return res.status(200).json({ status: "success", payload: { result: queryRes.result[0] } });
}


module.exports = { genBlogid, createBlog, getBlogById, getBlogs };