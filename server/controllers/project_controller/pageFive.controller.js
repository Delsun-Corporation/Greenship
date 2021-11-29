const Project = require("../../models/project.model");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types;
const multer = require("multer");
const { mimeTypeValidator } = require("../../helpers/valid");

const pvInstallAttachmentKey = "e_pv_install_att";
const pvSolarAttachmentKey = "e_pv_solar_att";

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

exports.updatePageFiveDraft = (req, res) => {
  const {
    e_facade_area,
    e_pv_spec_h,
    e_pv_spec_l,
    e_pv_spec_w,
    e_pv_spec_wpeak,
    e_result,
    projectId,
  } = req.body;

  const objectId = ObjectId.ObjectId(projectId);

  const files = req.files;
  var e_pv_install_att = ""
  var e_pv_solar_att = "";

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

  if(files) {
    if (files[pvSolarAttachmentKey] !== undefined) {
      e_pv_solar_att = `${process.env.SERVER_URL}/${files[pvSolarAttachmentKey][0].path}`;
    }
  
    if (files[pvInstallAttachmentKey] !== undefined) {
      e_pv_install_att = `${process.env.SERVER_URL}/${files[pvInstallAttachmentKey][0].path}`;
    }
  }

  Project.findById(objectId)
    .then((project) => {
      project.e_facade_area = e_facade_area;
      project.e_pv_spec_wpeak = e_pv_spec_wpeak;
      project.e_result = e_result;
      project.e_pv_install_att = e_pv_install_att;
      project.e_pv_solar_att = e_pv_solar_att;
      project.e_pv_spec_dimension = {
        h: e_pv_spec_h,
        l: e_pv_spec_l,
        w: e_pv_spec_w,
      };
      project.project_date = new Date();
      if (project.last_page < 5) {
        project.last_page = 5;
      }
      return project.save();
    })
    .then((result) => {
      if (result !== undefined) {
        res.status(200).json({
          message: "Success save page five draft",
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

exports.getPageFiveDraft = (req, res) => {
  const { projectId } = req.query;
  const objectId = ObjectId.ObjectId(projectId);

  if (!objectId) {
    return res.status(400).json({
      message: "Bad Request",
    });
  }

  Project.findById(objectId)
<<<<<<< HEAD
    .select("e_facade_area e_pv_spec_wpeak e_pv_spec_dimension total_dec a_gfa")
=======
    .select(`e_facade_area e_pv_spec_wpeak e_pv_spec_dimension total_dec ${pvSolarAttachmentKey} ${pvInstallAttachmentKey}`)
>>>>>>> main
    .then((page_five) => {
      if (!page_five) {
        return res.status(400).json({
          message: "Bad Request",
        });
      }

      const totalDesignEnergy =
        page_five.total_dec.lighting +
        page_five.total_dec.ac +
        page_five.total_dec.appliances +
        page_five.total_dec.utility +
        page_five.total_dec.plug;

      return res.status(200).json({
        page_five: {
          e_facade_area: page_five.e_facade_area,
          e_pv_spec_wpeak: page_five.e_pv_spec_wpeak,
          e_pv_spec_h: page_five.e_pv_spec_dimension.h,
          e_pv_spec_l: page_five.e_pv_spec_dimension.l,
          e_pv_spec_w: page_five.e_pv_spec_dimension.w,
          total_dec: totalDesignEnergy,
<<<<<<< HEAD
          a_gfa: page_five.a_gfa,
=======
          e_pv_solar_att: page_five.e_pv_solar_att,
          e_pv_install_att: page_five.e_pv_install_att,
>>>>>>> main
        },
        message: "Success getting page five draft",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Internal server error",
      });
    });
};

exports.uploadPageFiveImages = upload.fields([
  { name: pvSolarAttachmentKey, maxCount: 1 },
  { name: pvInstallAttachmentKey, maxCount: 1 }
]);