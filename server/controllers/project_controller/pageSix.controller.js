const Project = require("../../models/project.model");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types;

exports.getPageSixDraft = (req, res) => {
    const { projectId } = req.query;
    const objectId = ObjectId.ObjectId(projectId);
  
    if (!objectId) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
  
    Project.findById(objectId)
      .select("a_typology a_gfa a_ach c_utility total_dec d_b_velocity d_c_access_area d_d_illuminance d_e_temperature d_total_bhc d_f_noise_level e_result")
      .then((result) => {
        if (!result) {
          return res.status(400).json({
            message: "Bad Request",
          });
        }

        const a_typology = result.a_typology;
        var a_typology_acoustic = "";
        var a_typology_eci = "";
        const mv_flow_rate = result.c_utility.items[4].mv_flow_rate;
        
        if (a_typology.toLowerCase() === 'homes') {
            a_typology_acoustic = '30 – 35 dBA';
            a_typology_eci = "240 kWh/m2 per year";
          } else if (a_typology.toLowerCase() === 'office') {
            a_typology_acoustic = '30 – 45 dBA';
            a_typology_eci = "240 kWh/m2 per year";
        } else if (a_typology.toLowerCase() === 'mall') {
            a_typology_acoustic = '40 – 55 dBA';
            a_typology_eci = "330 kWh/m2 per year";
        } else if (a_typology.toLowerCase() === 'apartment') {
            a_typology_acoustic = '30 – 35 dBA';
            a_typology_eci = "300 kWh/m2 per year";
        } else if (a_typology.toLowerCase() === 'hotel' ) {
            a_typology_acoustic = '30 – 35 dBA';
            a_typology_eci = "300 kWh/m2 per year";
        } else if (a_typology.toLowerCase() === 'hospital') {
            a_typology_acoustic = '30 – 35 dBA';
            a_typology_eci = "380 kWh/m2 per year";
        } else {
            a_typology_acoustic = '30 – 35 dBA';
            a_typology_eci = "380 kWh/m2 per year";
        }
  
        return res.status(200).json({
          message: "Success getting page six data",
          firstForm: {
            a_typology_eci: a_typology_eci,
            a_typology_acoustic: a_typology_acoustic,
            a_ach: result.a_ach,
            a_gfa: result.a_gfa
        },
        thirdForm: {
            mv_flow_rate: mv_flow_rate,
            total_dec: result.total_dec
        },
        fourthForm: {
            d_b_velocity: result.d_b_velocity,
            d_c_access_area: result.d_c_access_area,
            d_d_illuminance: result.d_d_illuminance.items,
            d_e_temperature: result.d_e_temperature,
            d_f_noise_level: result.d_f_noise_level,
            d_total_bhc: result.d_total_bhc
        },
        fifthForm: {
            e_result: result.e_result
        }
        });
      })
      .catch((err) => {
          console.log(err)
        return res.status(500).json({
          message: "Internal server error",
        });
      });
  };