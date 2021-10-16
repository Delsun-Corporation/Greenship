const express = require('express');
const router = express.Router();

const {
    createProject,
    getProjects,
    getPageOneDraft,
    updatePageOneDraft,
} = require('../controllers/product.controller.js');

router.post('/createproject', createProject);

router.put('/updatepageone', updatePageOneDraft);

router.get('/getprojects', getProjects);
router.get('/getpageone', getPageOneDraft);

module.exports = router;