const express = require('express');
const router = express.Router();

const {
    createProject,
    getProjects
} = require('../controllers/product.controller.js');

router.post('/createproject', createProject);
router.get('/getprojects', getProjects);

module.exports = router;