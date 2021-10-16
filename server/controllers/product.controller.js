const mongoose = require("mongoose");
const Project = require("../models/project.model");
const User = require("../models/auth.model");

exports.createProject = (req, res) => {
  const userId = req.body.id;
  var objectId = mongoose.Types.ObjectId(userId);
  const NewProject = new Project({
    project_owner: objectId,
  });
  NewProject.save().then((result) => {
    console.log(result);
    res.status(200).json({
      message: "success",
    });
  });
};

exports.getProjects = (req, res) => {
  const userId = req.body.id;
  var objectId = mongoose.Types.ObjectId(userId);

  Project.find({ userId: objectId })
    .select('project_name project_desc project_status project_image project_owner _id')
    .then((projects) => {
      res.status(200).json({
        message: "Success",
        projects: projects,
      });
    });
};
