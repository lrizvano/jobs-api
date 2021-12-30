const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const foundJobs = await Job.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ count: foundJobs.length, foundJobs });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { jobId },
  } = req;
  const foundJob = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!foundJob) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ foundJob });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const createdJob = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ createdJob });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { jobId },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("Company and Position fields cannot be empty");
  }
  const updatedJob = await Job.findByIdAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedJob) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { jobId },
  } = req;
  const deletedJob = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!deletedJob) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
