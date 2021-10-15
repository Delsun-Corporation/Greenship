const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    project_name: {
      type: String,
      default: "Untitled",
    },
    project_desc: {
      type: String,
      default: "No Description",
    },
    project_status: {
      type: String,
      default: "Draft",
    },
    project_image: {
      type: String,
      default: "",
    },
    project_owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project_date: {
      type: Date,
      default: new Date(),
    },
    a_typology: {
      type: String,
      default: "",
    },
    a_location_province: {
      type: String,
      default: "",
    },
    a_location_city: {
      type: String,
      default: "",
    },
    a_location_image: {
      type: [String],
      default: [],
    },
    a_gfa: {
      type: Number,
      default: 0,
    },
    a_floor_count: {
      type: Number,
      default: 0,
    },
    a_floor_height_avg: {
      type: Number,
      default: 0,
    },
    a_occupancy_hours: {
      type: Number,
      default: 0,
    },
    a_operational_hours: {
      type: Number,
      default: 0,
    },
    a_working_days: {
      type: Number,
      default: 0,
    },
    a_holidays: {
      type: Number,
      default: 0,
    },
    a_ventilation_area: {
      type: Number,
      default: 0,
    },
    a_orientation_image: {
      type: [String],
      default: [],
    },
    a_micro_noise_image: {
      type: String,
      default: "",
    },
    a_energy_place_image: {
      type: String,
      default: "",
    },
    a_ach: {
      type: Number,
      default: 0,
    },
    b_ottv: {
      type: Number,
      default: 0,
    },
    b_shgc: {
      type: Number,
      default: 0,
    },
    b_window_area: {
      type: [Number],
      default: [],
    },
    b_wall_area: {
      type: [Number],
      default: 0,
    },
    c_lighting: {
      items: [
        {
          name: {
            type: String,
            default: "",
          },
          daylight_area: {
            type: Number,
            default: 0,
          },
          lpd_operate: {
            type: Number,
            default: 0,
          },
          lpd_operate_attach: {
            type: [String],
            default: [],
          },
          lpd_nonoperate: {
            type: Number,
            default: 0,
          },
          lpd_nonoperate_attach: {
            type: [String],
            default: [],
          },
        },
      ],
    },
    c_ac: {
      to_ti: {
        type: Number,
        default: 0,
      },
    },
    c_appliances: {
      items: [
        {
          name: {
            type: String,
            default: "",
          },
          amount: {
            type: Number,
            default: 0,
          },
          watt: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    c_utility: {
      items: [
        {
          name: {
            type: String,
            default: "",
          },
          amount: {
            type: Number,
            default: 0,
          },
          watt: {
            type: Number,
            default: 0,
          },
          util_type: {
            type: String,
            default: "",
          },
          mv_flow_rate: {
            type: Number,
          },
          lift_capacity: {
            type: Number,
          },
          lift_velocity: {
            type: Number,
          },
        },
      ],
    },
    c_plug: {
      items: [
        {
          operating_power: {
            type: Number,
            default: 0,
          },
          nonoperating_power: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    d_a_is_potential: {
      type: Boolean,
      default: false,
    },
    d_a_attachment: {
      type: String,
      default: "",
    },
    d_a_ra: {
      type: Number,
      default: 0,
    },
    d_a_rp: {
      type: Number,
      default: 0,
    },
    d_b_velocity: {
      type: Number,
      default: 0,
    },
    d_c_access_att: {
      type: [String],
      default: [],
    },
    d_c_access_area: {
      type: Number,
      default: 0,
    },
    d_d_lighting_plan_att: {
      type: [String],
      default: [],
    },
    d_d_illuminance: {
      items: [
        {
          room_activity: {
            type: Number,
            default: 0,
          },
          area: {
            type: Number,
            default: 0
          },
          lamp_type: {
            type: String,
            default: ""
          },
          lamp_count: {
            type: Number,
            default: ""
          },
          lamp_power: {
            type: Number,
            default: 0
          },
          lamp_lumen: {
            type: Number,
            default: 0
          }
        },
      ],
    },
    d_e_temperature: {
      type: Number,
      default: 0
    },
    d_f_noise_level: {
      type: Number,
      default: 0
    },
    d_f_noise_att: {
      type: [String],
      default: []
    },
    d_f_noise_control_att: {
      type: [String],
      default: 0
    },
    e_facade_area: {
      type: Number,
      default: 0
    },
    e_pv_install_att: {
      type: [String],
      default: []
    },
    e_pv_spec_wpeak: {
      type: Number,
      default: 0
    },
    e_pv_spec_dimension: {
      type: [Number],
      default: 0
    }
  }
);

module.exports = mongoose.model("Project", projectSchema);
