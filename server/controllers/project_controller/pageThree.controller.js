const Project = require("../../models/project.model");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types;

const daylightAreaKey = "daylight_area_attach";
const nonoperateKey = "lpd_nonoperate_attach";
const operateKey = "lpd_operate_attach";

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
  limits: {
    fileSize: 1024 * 1024 * 20
  }
});

exports.updatePageThreeDraft = (req, res) => {
  const {
    c_ac,
    c_appliances,
    c_lighting,
    c_plug,
    c_utility,
    total_dec,
    projectId,
    operationalImageIndex,
    nonoperationalImageIndex,
    daylightImageIndex
  } = req.body;

  const objectId = ObjectId.ObjectId(projectId);
  const files = req.files;

  if (
    req.body === {} ||
    req.body === null ||
    req.body === undefined ||
    projectId === null ||
    projectId === undefined
  ) {
    return res.status(400).json({
      message: "Request parameter is wrong",
    });
  }

  Project.findById(objectId)
    .then((project) => {

      var c_lighting_items = compileLighting(c_lighting, files, project.c_lighting.items, daylightImageIndex, nonoperationalImageIndex, operationalImageIndex);
      
      project.c_ac = c_ac;
      project.c_appliances.items = c_appliances;
      project.c_lighting.items = c_lighting_items;
      project.c_plug = c_plug;
      project.c_utility.items = c_utility;
      project.total_dec = total_dec;
      project.project_date = new Date();
      if (project.last_page < 3) {
        project.last_page = 3;
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
      console.log(err);
      res.status(500).json({
        message: "Internal server error",
      });
    });
};

const compileLighting = (c_lighting, files, defaultValues, daylightImageIndex, nonoperationalImageIndex, operationalImageIndex) => {
  var tempArray = [];

  // merge incoming with existing value
  for (let index = 0; index < c_lighting.length; index++) {
    const element = c_lighting[index];
    const defaultValue = defaultValues[index];

    if (defaultValue) {
      if (defaultValue.daylight_area_attach) {
        element.daylight_area_attach = defaultValue.daylight_area_attach;
      }
  
      if (defaultValue.lpd_nonoperate_attach) {
        element.lpd_nonoperate_attach = defaultValue.lpd_nonoperate_attach;
      }
  
      if (defaultValue.lpd_operate_attach) {
        element.lpd_operate_attach = defaultValue.lpd_operate_attach;
      }
    }
    
    tempArray.push(element);
  }
  
  if (daylightImageIndex) {
    for (let i = 0; i < daylightImageIndex.length; i++) {
      const index = daylightImageIndex[i];
      if(files) {
        if (files[daylightAreaKey] !== undefined) {
          if (files[daylightAreaKey][i] !== undefined) { 
            tempArray[index].daylight_area_attach = `${process.env.SERVER_URL}/${files[daylightAreaKey][i].path}`;
          } 
        }
      }
    }
  }

  if (nonoperationalImageIndex) {
    for (let i = 0; i < nonoperationalImageIndex.length; i++) {
      const index = nonoperationalImageIndex[i];
      if(files) {
        if (files[nonoperateKey] !== undefined) {
          if (files[nonoperateKey][i] !== undefined) { 
            tempArray[index].lpd_nonoperate_attach = `${process.env.SERVER_URL}/${files[nonoperateKey][i].path}`;
          } 
        }
      }
    }
  }

  if (operationalImageIndex) {
    for (let i = 0; i < operationalImageIndex.length; i++) {
      const index = operationalImageIndex[i];
      if(files) {
        if (files[operateKey] !== undefined) {
          if (files[operateKey][i] !== undefined) { 
            tempArray[index].lpd_operate_attach = `${process.env.SERVER_URL}/${files[operateKey][i].path}`;
          } 
        }
      }
    }
  }

  return tempArray;
}

exports.getPageThreeDraft = (req, res) => {
  const { projectId } = req.query;
  const objectId = ObjectId.ObjectId(projectId);

  if (!objectId) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  Project.findById(objectId)
    .select(
      "a_gfa a_operational_hours a_working_days a_holidays a_occupancy_density a_ach a_floor_count a_floor_height_avg b_window_area b_wall_area c_lighting c_ac c_appliances c_utility c_plug total_dec"
    )
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
          total_dec: result.total_dec,
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
          b_wall_area: result.b_wall_area,
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

exports.uploadPageThreeImages = upload.fields([
  { name: daylightAreaKey },
  { name: nonoperateKey },
  { name: operateKey },
]);
