const mongoose = require("mongoose");
const Project = require("../../models/project.model");

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
      const projectLastPage = result.last_page;
      res.status(200).json({
        message: "success",
        projectId: projectId,
        last_page: projectLastPage
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
  var objectId = new mongoose.Types.ObjectId(userId);

  Project.find({ project_owner: objectId })
    .select(
      "project_name project_desc project_status project_image project_owner _id last_page"
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

exports.deleteProject = (req, res) => {
  const projectId = req.body.projectId;
  const objectId = ObjectId.ObjectId(projectId);

  Project.findByIdAndDelete(objectId)
    .then((result) => {
      if (!objectId) {
        return res.status(400).json({
          message: "Bad projectId",
        });
      } else if (!result) {
        return res.status(401).json({
          message: "No Project was found",
        });
      } else {
        return res.status(200).json({
          message: "Success Deleting project",
        });
      }
    })
    .catch((err) => {
      res.status(402).json({
        message: "Failed to delete project",
      });
    });
};

exports.getLastPage = (req, res) => {
  const { projectId } = req.query;

  if (projectId === undefined || projectId === null) {
    return res.status(400).json({
      message: "Bad request!",
    });
  }

  Project.findById(projectId)
    .select("last_page")
    .then((lastPage) => {
      if (!lastPage || lastPage === {}) {
        return res.status(402).json({
          message: 'No project found'
        })
      }
      res.status(200).json({
        message: "Success getting last page",
        last_page: lastPage,
      });
    })
    .catch((err) => {
      res.status(402).json({
        message: "Failed to get last page",
      });
    });
};

exports.postLastPage = (req, res) => {
  const { projectId, last_page } = req.body;

  if (projectId === undefined || projectId === null) {
    return res.status(400).json({
      message: "Bad request!",
    });
  }

  Project.findById(projectId)
    .then((project) => {
      if (!project || project === {}) {
        return res.status(402).json({
          message: "No project found",
        });
      }
      const updatedLastPage = last_page;
      project.last_page = updatedLastPage;
      return project.save();
    })
    .then((result) => {
      return res.status(200).json({
        message: "Success to post last page",
      });
    })
    .catch((err) => {
      return res.status(402).json({
        message: "Failed to get last page",
      });
    });
};
