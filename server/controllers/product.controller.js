const mongoose = require("mongoose");
const Project = require("../models/project.model");
const User = require("../models/auth.model");

const ObjectId = mongoose.Types;

exports.createProject = (req, res) => {
  const userId = req.body.id;
  var objectId = mongoose.Types.ObjectId(userId);
  const NewProject = new Project({
    project_owner: objectId,
  });
  NewProject.save()
    .then((result) => {
      const projectId = result._id;
      res.status(200).json({
        message: "success",
        projectId: projectId,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Internal Server Error",
      });
    });
};

exports.getProjects = (req, res) => {
  const userId = req.query.id;
  console.log(userId);
  var objectId = new mongoose.Types.ObjectId(userId);

  Project.find({ project_owner: objectId })
    .select(
      "project_name project_desc project_status project_image project_owner _id"
    )
    .then((projects) => {
      res.status(200).json({
        message: "success",
        projects: projects,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Internal Server Error",
      });
    });
};

exports.getPageOneDraft = (req, res) => {
  const projectId = req.query.id;
  const objectId = mongoose.Types.ObjectId(projectId);

  Project.findOne({_id: objectId})
    .select(
      "project_name project_desc project_status project_image project_date a_typology a_location_province a_location_city a_location_image a_gfa a_floor_count a_floor_height_avg a_occupancy_hours a_operational_hours a_working_days a_holidays a_ventilation_area a_orientation_image a_micro_noise_image a_energy_place_image a_ach"
    )
    .then((page_one) => {
      if (page_one) {
        res.status(200).json({
          message: "success",
          page_one: page_one,
        });
      } else {
        res.status(400).json({
          message: "There is no such page"
        });
      }
    })
    .catch((err) => {
      res.status(402).json({
        message: "Internal Server Error",
      });
    });
};

exports.updatePageOneDraft = (req, res) => {
  const projectId = req.body.projectId;
  const objectId = ObjectId.ObjectId(projectId);
  const updatedTitle = req.body.project_name;
  const updatedDesc = req.body.project_desc;

  Project.findById(objectId)
    .then((project) => {
      project.project_name = updatedTitle;
      project.project_desc = updatedDesc;
      project.markModified("project_date");
      return project.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "success",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Internal Server Error",
      });
    });
};
