const { executeQuery } = require("../utils/database");
const {getBlogsQuery, getBlogByIdQuery, initializeBlog, initializeMainBlog, getTotalBlogsQuery} = require("../constants/queries");



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
  const { title, summary, content,  employeeId, registerCounter } = req.body;

  if (title === undefined || summary === undefined) {
    return res.status(206).json({ success: false, payload: { message: "Partial Content Provided" } });
  }

  if (title.length > 50) {
    return res.status(406).json({ success: false, payload: { message: "Not Acceptable. Data Length Exceeds Limit" } });
  }

  const blogId = genBlogid(registerCounter);
  const imageId = genBlogid(registerCounter);
  const blogDetails = [blogId, title, summary, imageId, employeeId];
  const queryRes1 = await executeQuery(initializeBlog, blogDetails);
  
  // Return If Creation Unsuccessful
  if (!queryRes1.success) {
    return res.status(501).json({ success: queryRes1.success, payload: queryRes1.result });
  }


  const queryRes2 = await executeQuery(initializeMainBlog, [blogId, content, imageId]);

  if (!queryRes2.success) {
    return res.status(501).json({ success: queryRes2.success, payload: queryRes2.result });
  }

  return res
    .status(201)
    .json({ success: true, payload: { message: "Blog Creation Successful" } });

}


const getBlogById = async (req, res) => {
    const blogId  = req.query.id;
    const queryRes = await executeQuery(getBlogByIdQuery, [blogId]);
    // Return If Query Unsuccessful
    if (!queryRes.success) {
      return res
        .status(404)
        .json({ success: queryRes.success, payload: { message: "Blog Not Found", result: queryRes.result } });
    }

    return res.status(200).json({ status: "success", payload: { result: queryRes.result[0] } });
}


const getBlogs = async (req, res) => {
  const start = parseInt(req.query.start, 10) || 0;
  const end = parseInt(req.query.end, 10) || 8;
  const blogs = await executeQuery(getTotalBlogsQuery);
  const totalNumberOfBlogs = blogs.result[0][0].totalBlogs
  const queryRes = await executeQuery(getBlogsQuery, [end - start, start]);
  if (!queryRes.success) {
    return res.status(404).json({
      success: queryRes.success,
      payload: { message: "Blogs Not Available", result: queryRes.result },
    });
  }

  return res.status(200).json({
    status: "success",
    payload: { result: queryRes.result[0], total: totalNumberOfBlogs },
  });
};

const updateBlogImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, payload: { message: "File Not Found" } });
  }

  return res.status(200).json({ success: true, payload: { message: "Profile Picture Updated Successfully" } });
};

module.exports = { genBlogid, createBlog, getBlogById, getBlogs, updateBlogImage };