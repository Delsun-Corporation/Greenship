const Project = require("../../models/project.model");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types;

exports.updatePageTwoDraft = (req, res) => {
  const { b_ottv, b_shgc, b_window_area, b_wall_area, projectId } = req.body;

  const objectId = ObjectId.ObjectId(projectId);

  if (req.body === {} || req.body === null || req.body === undefined || projectId === null || projectId === undefined) {
    return res.status(400).json({
      message: "Request parameter is wrong",
    });
  }

  Project.findById(objectId)
    .then((project) => {
      project.b_ottv = b_ottv;
      project.b_shgc = b_shgc;
      project.b_window_area = b_window_area;
      project.b_wall_area = b_wall_area;
      project.project_date = new Date();
      return project.save();
    })
    .then((result) => {
      if (result !== undefined) {
        res.status(200).json({
          message: "Success save page two draft",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server error",
      });
    });
};

exports.getPageTwoDraft = (req, res) => {
  const { projectId } = req.query;
  const objectId = ObjectId.ObjectId(projectId);

  if (!objectId) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  Project.findById(objectId)
    .select("b_ottv b_shgc b_window_area b_wall_area")
    .then((page_two) => {
      if (!page_two) {
        return res.status(400).json({
          message: "Bad Request",
        });
      }

      return res.status(200).json({
        page_two: page_two,
        message: "Success getting page two draft",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal server error",
      });
    });
};
