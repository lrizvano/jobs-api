const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/JobController");

router.route("/").get(getAllJobs).post(createJob);
router.route("/:jobId").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
