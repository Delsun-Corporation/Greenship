const Project = require("../../models/project.model");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types;

exports.updatePageThreeDraft = (req, res) => {
  const { c_ac, c_appliances, c_lighting, c_plug, c_utility, total_dec, projectId } = req.body;

  const objectId = ObjectId.ObjectId(projectId);

  if (req.body === {} || req.body === null || req.body === undefined || projectId === null || projectId === undefined) {
    return res.status(400).json({
      message: "Request parameter is wrong",
    });
  }

  Project.findById(objectId)
    .then((project) => {
      project.c_ac = c_ac;
      project.c_appliances.items = c_appliances;
      project.c_lighting.items = c_lighting;
      project.c_plug = c_plug;
      project.c_utility.items = c_utility;
      project.total_dec = total_dec;
      project.project_date = new Date();
      if (project.last_page < 3) {
        project.last_page = 3
      }
      return project.save();
    })
    .then((result) => {
      if (result !== undefined) {
        res.status(200).json({
          message: "Success save page three draft",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server error",
      });
    });
};

exports.getPageThreeDraft = (req, res) => {
  const { projectId } = req.query;
  const objectId = ObjectId.ObjectId(projectId);

  if (!objectId) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  Project.findById(objectId)
    .select("a_gfa a_operational_hours a_working_days a_holidays a_occupancy_density a_ach a_floor_count a_floor_height_avg b_window_area b_wall_area c_lighting c_ac c_appliances c_utility c_plug total_dec")
    .then((result) => {
      if (!result) {
        return res.status(400).json({
          message: "Bad Request",
        });
      }

      return res.status(200).json({
        page_three: {
            c_lighting: result.c_lighting,
            c_ac: result.c_ac, 
            c_appliances: result.c_appliances, 
            c_utility: result.c_utility, 
            c_plug: result.c_plug,
            total_dec: result.total_dec
        },
        page_one: {
            a_gfa: result.a_gfa,
            a_operational_hours: result.a_operational_hours, 
            a_working_days: result.a_working_days,
            a_holidays: result.a_holidays, 
            a_occupancy_density: result.a_occupancy_density, 
            a_ach: result.a_ach, 
            a_floor_count: result.a_floor_count, 
            a_floor_height_avg: result.a_floor_height_avg,
        },
        page_two: {
            b_window_area: result.b_window_area,
            b_wall_area: result.b_wall_area
        },
        message: "Success getting page two draft",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal server error",
      });
    });
};
