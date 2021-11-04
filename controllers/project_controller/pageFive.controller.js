const Project = require("../../models/project.model");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types;

exports.updatePageFiveDraft = (req, res) => {
  const { e_facade_area, e_pv_spec_h, e_pv_spec_l, e_pv_spec_w, e_pv_spec_wpeak, projectId } = req.body;

  const objectId = ObjectId.ObjectId(projectId);

  if (req.body === {} || req.body === null || req.body === undefined || projectId === null || projectId === undefined) {
    return res.status(400).json({
      message: "Request parameter is wrong",
    });
  }

  Project.findById(objectId)
    .then((project) => {
      project.e_facade_area = e_facade_area;
      project.e_pv_spec_wpeak = e_pv_spec_wpeak;
      project.e_pv_spec_dimension = {
          h: e_pv_spec_h,
          l: e_pv_spec_l,
          w: e_pv_spec_w
      }
      project.project_date = new Date();
      if (project.last_page < 5) {
        project.last_page = 5
      }
      return project.save();
    })
    .then((result) => {
      if (result !== undefined) {
        res.status(200).json({
          message: "Success save page five draft",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server error",
      });
    });
};

exports.getPageFiveDraft = (req, res) => {
  const { projectId } = req.query;
  const objectId = ObjectId.ObjectId(projectId);

  if (!objectId) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  Project.findById(objectId)
    .select("e_facade_area e_pv_spec_wpeak e_pv_spec_dimension")
    .then((page_five) => {
      if (!page_five) {
        return res.status(400).json({
          message: "Bad Request",
        });
      }

      return res.status(200).json({
        page_five: {
            e_facade_area: page_five.e_facade_area,
            e_pv_spec_wpeak: page_five.e_pv_spec_wpeak,
            e_pv_spec_h: page_five.e_pv_spec_dimension.h,
            e_pv_spec_l: page_five.e_pv_spec_dimension.l,
            e_pv_spec_w: page_five.e_pv_spec_dimension.w,
        },
        message: "Success getting page five draft",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal server error",
      });
    });
};
