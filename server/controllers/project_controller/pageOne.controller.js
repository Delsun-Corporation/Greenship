const Project = require("../../models/project.model");
const mongoose = require("mongoose");
const multer = require("multer");
const { mimeTypeValidator } = require("../../helpers/valid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (mimeTypeValidator(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// add limits: fileSize in here to limit image size
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const ObjectId = mongoose.Types;

exports.getPageOneDraft = (req, res) => {
  const projectId = req.query.id;
  const objectId = ObjectId.ObjectId(projectId);

  Project.findOne({ _id: objectId })
    .select(
      "project_name project_desc project_status project_image project_date a_typology a_location_province a_location_city a_location_image a_gfa a_floor_count a_floor_height_avg a_occupancy_density a_operational_hours a_working_days a_holidays a_ventilation_area a_orientation_image a_micro_noise_image a_energy_place_image a_ach"
    )
    .then((page_one) => {
      if (page_one) {
        res.status(200).json({
          message: "success",
          page_one: page_one,
        });
      } else {
        res.status(400).json({
          message: "There is no such page",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal Server Error",
      });
    });
};

exports.updatePageOneDraft = (req, res) => {
  const projectId = req.body.projectId;
  const objectId = ObjectId.ObjectId(projectId);
  const updatedTitle = req.body.project_name;
  const updatedDesc = req.body.project_desc;
  const updatedWorkDay = req.body.a_working_days;
  const updatedTypology = req.body.a_typology;
  const updatedLocation = req.body.a_location_city;
  const updatedGFA = req.body.a_gfa;
  const updatedFloorCount = req.body.a_floor_count;
  const updatedFloorAvg = req.body.a_floor_height_avg;
  const updatedOccupancyDensity = req.body.a_occupancy_density;
  const updatedOperationalHours = req.body.a_operational_hours;
  const updatedHolidays = req.body.a_holidays;
  const updatedVentilationArea = req.body.a_ventilation_area;
  const updatedAch = req.body.a_ach;
  const updatedProvince = req.body.a_location_province;
  var projectImage =
    "https://firebasestorage.googleapis.com/v0/b/ina-website-326209.appspot.com/o/resource%2FNoImageDefault.png?alt=media&token=ac9bfea9-44db-4dca-9293-64da65636021";
  var locationImage = "";
  var microNoiseImage = "";
  var energyPlaceImage = "";
  var orientationImage = "";

  const energyKeyName = "a_energy_place_image";
  const projectImageKeyName = "a_project_image";
  const locationKeyName = "a_location_image";
  const orientationKeyName = "a_orientation_image";
  const microKeyName = "a_micro_noise_image";

  if (req.files[projectImageKeyName] != undefined) {
    projectImage = `${process.env.SERVER_URL}/${req.files[projectImageKeyName][0].path}`;
  }

  if (req.files[locationKeyName] != undefined) {
    locationImage = `${process.env.SERVER_URL}/${req.files[locationKeyName][0].path}`;
  }

  if (req.files[orientationKeyName] != undefined) {
    orientationImage = `${process.env.SERVER_URL}/${req.files[orientationKeyName][0].path}`;
  }

  if (req.files[microKeyName] != undefined) {
    microNoiseImage = `${process.env.SERVER_URL}/${req.files[microKeyName][0].path}`;
  }

  if (req.files[energyKeyName] != undefined) {
    energyPlaceImage = `${process.env.SERVER_URL}/${req.files[energyKeyName][0].path}`;
  }

  Project.findById(objectId)
    .then((project) => {
      if (!project) {
        res.status(400).json({
          message: "Request Parameter is wrong",
        });
      }
      project.project_name = updatedTitle;
      project.project_desc = updatedDesc;
      project.a_working_days = updatedWorkDay;
      project.a_typology = updatedTypology;
      project.a_location_city = updatedLocation;
      project.a_gfa = updatedGFA;
      project.a_floor_count = updatedFloorCount;
      project.a_floor_height_avg = updatedFloorAvg;
      project.a_occupancy_density = updatedOccupancyDensity;
      project.a_operational_hours = updatedOperationalHours;
      project.a_holidays = updatedHolidays;
      project.a_ventilation_area = updatedVentilationArea;
      project.a_ach = updatedAch;
      project.project_date = new Date();
      project.a_location_province = updatedProvince;
      project.project_image = projectImage;
      project.a_location_image = locationImage;
      project.a_orientation_image = orientationImage;
      project.a_micro_noise_image = microNoiseImage;
      project.a_energy_place_image = energyPlaceImage;
      return project.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "success",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    });
};

exports.uploadProjectImage = upload.fields([
  { name: "a_project_image", maxCount: 1 },
  { name: "a_location_image", maxCount: 1 },
  { name: "a_orientation_image", maxCount: 1 },
  { name: "a_micro_noise_image", maxCount: 1 },
  { name: "a_energy_place_image", maxCount: 1 },
]);
