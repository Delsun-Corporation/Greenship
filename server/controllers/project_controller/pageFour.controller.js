const Project = require("../../models/project.model");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types;

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
      "a_gfa a_occupancy_density a_ach a_floor_count a_floor_height_avg a_ventilation_area a_ach a_typology c_utility d_a_is_potential d_a_rp d_a_ra d_a_az d_b_velocity d_c_access_area d_d_illuminance d_e_temperature d_f_noise_level"
    )
    .then((result) => {
      if (!result) {
        return res.status(400).json({
          message: "Bad Request",
        });
      }

      var mw_flow_rate = result.c_utility.items[4].mv_flow_rate;
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
            mv_flow_rate: mw_flow_rate
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
            d_f_noise_level: result.d_f_noise_level
        },
        message: "Success getting page four draft",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal server error",
      });
    });
};
