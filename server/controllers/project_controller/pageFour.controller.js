const Project = require("../../models/project.model");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types;

const multer = require("multer");
const { mimeTypeValidator } = require("../../helpers/valid");

const aAttachmentKey = "d_a_attachment";
const accessKey = "d_c_access_att";
const lightingPlanKey = "d_d_lighting_plan_att";
const fNoiseKey = "d_f_noise_att";
const noiseControlKey = "d_f_noise_control_att";

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

exports.updatePageFourDraft = (req, res) => {
  const {
    projectId,
    d_a_az,
    d_a_is_potential,
    d_a_ra,
    d_a_rp,
    d_b_velocity,
    d_c_access_area,
    d_d_illuminance,
    d_e_temperature,
    d_f_noise_level,
    d_total_bhc
  } = req.body;

  const files = req.files;

  const objectId = ObjectId.ObjectId(projectId);
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
      var d_a_attachment = project.d_a_attachment;
      var d_c_access_att = project.d_c_access_att;
      var d_d_lighting_plan_att = project.d_d_lighting_plan_att;
      var d_f_noise_att = project.d_f_noise_att;
      var d_f_noise_control_att = project.d_f_noise_control_att;

      if(files) {
        if (files[aAttachmentKey] !== undefined) {
          d_a_attachment = `${process.env.SERVER_URL}/${files[aAttachmentKey][0].path}`;
        }
      
        if (files[accessKey] !== undefined) {
          d_c_access_att = `${process.env.SERVER_URL}/${files[accessKey][0].path}`;
        }
      
        if (files[lightingPlanKey] !== undefined) {
          d_d_lighting_plan_att = `${process.env.SERVER_URL}/${files[lightingPlanKey][0].path}`;
        }
      
        if (files[noiseControlKey] !== undefined) {
          d_f_noise_control_att = `${process.env.SERVER_URL}/${files[noiseControlKey][0].path}`;
        }
      
        if (files[fNoiseKey] !== undefined) {
          d_f_noise_att = `${process.env.SERVER_URL}/${files[fNoiseKey][0].path}`;
        }
      }
      
      project.d_a_az = d_a_az;
      project.d_a_is_potential = Boolean(d_a_is_potential);
      project.d_a_ra = d_a_ra;
      project.d_a_rp = d_a_rp;
      project.d_b_velocity = d_b_velocity;
      project.d_c_access_area = d_c_access_area;
      project.d_d_illuminance.items = d_d_illuminance;
      project.d_e_temperature = d_e_temperature;
      project.d_f_noise_level = d_f_noise_level;
      project.d_total_bhc = d_total_bhc;
      project.d_f_noise_att = d_f_noise_att;
      project.d_f_noise_control_att = d_f_noise_control_att;
      project.d_a_attachment = d_a_attachment;
      project.d_d_lighting_plan_att = d_d_lighting_plan_att;
      project.d_c_access_att = d_c_access_att;
      project.project_date = new Date();
      if (project.last_page < 4) {
        project.last_page = 4;
      }
      return project.save();
    })
    .then((result) => {
      if (result !== undefined) {
        res.status(200).json({
          message: "Success save page four draft",
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

exports.getPageFourDraft = (req, res) => {
  const { projectId } = req.query;
  const objectId = ObjectId.ObjectId(projectId);

  if (!objectId) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  Project.findById(objectId)
    .select(
      `a_gfa a_occupancy_density a_ach a_floor_count a_floor_height_avg a_ventilation_area a_ach a_typology c_utility d_a_is_potential d_a_rp d_a_ra d_a_az d_b_velocity d_c_access_area d_d_illuminance d_e_temperature d_f_noise_level ${accessKey} ${aAttachmentKey} ${lightingPlanKey} ${fNoiseKey} ${noiseControlKey}`
    )
    .then((result) => {
      if (!result) {
        return res.status(400).json({
          message: "Bad Request",
        });
      }

      const mw_flow_rate = result.c_utility.items[4].mv_flow_rate;
      const mv_amount = result.c_utility.items[4].amount;
      var a_typology = result.a_typology;
      var a_typology_acoustic = '';

      if (a_typology.toLowerCase() === 'homes' || a_typology.toLowerCase() == 'apartment' || a_typology.toLowerCase() == 'hotel' || a_typology.toLowerCase() == 'hospital' ) {
        a_typology_acoustic = '30 – 35 dBA';
      } else if (a_typology.toLowerCase() == 'office') {
        a_typology_acoustic = '30 – 45 dBA';
    } else if (a_typology.toLowerCase() == 'mall') {
        a_typology_acoustic = '40 – 55 dBA';
    } else {
        a_typology_acoustic = '30 – 35 dBA';
    }

      return res.status(200).json({
        page_three: {
            mv_flow_rate: mw_flow_rate,
            mv_amount: mv_amount
        },
        page_one: {
          a_gfa: result.a_gfa,
          a_occupancy_density: result.a_occupancy_density,
          a_ach: result.a_ach,
          a_floor_count: result.a_floor_count,
          a_floor_height_avg: result.a_floor_height_avg,
          a_ventilation_area: result.a_ventilation_area,
          a_typology_acoustic: a_typology_acoustic
        },
        page_four: {
            d_a_is_potential: result.d_a_is_potential,
            d_a_rp: result.d_a_rp,
            d_a_ra: result.d_a_ra,
            d_a_az: result.d_a_az,
            d_b_velocity: result.d_b_velocity,
            d_c_access_area: result.d_c_access_area,
            d_d_illuminance: result.d_d_illuminance,
            d_e_temperature: result.d_e_temperature,
            d_f_noise_level: result.d_f_noise_level,
            d_a_attachment: result.d_a_attachment,
            d_f_noise_att: result.d_f_noise_att,
            d_c_access_att: result.d_c_access_att,
            d_d_lighting_plan_att: result.d_d_lighting_plan_att,
            d_f_noise_control_att: result.d_f_noise_control_att
        },
        message: "Success getting page four draft",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    });
};

exports.uploadPageFourImages = upload.fields([
  { name: aAttachmentKey, maxCount: 1 },
  { name: accessKey, maxCount: 1 },
  { name: lightingPlanKey, maxCount: 1 },
  { name: noiseControlKey, maxCount: 1 },
  { name: fNoiseKey, maxCount: 1 },
]);
