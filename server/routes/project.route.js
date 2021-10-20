const express = require('express');
const router = express.Router();

const {
    createProject,
    getProjects,
    getPageOneDraft,
    updatePageOneDraft,
    deleteProject,
    getPageTwoDraft,
    updatePageTwoDraft
} = require('../controllers/product.controller.js');

router.post('/createproject', createProject);

router.put('/updatepageone', updatePageOneDraft);
router.put('/updatepagetwo', updatePageTwoDraft);

router.delete('/deleteproject', deleteProject);

router.get('/getprojects', getProjects);
router.get('/getpageone', getPageOneDraft);
router.get('/getpagetwo', getPageTwoDraft);

module.exports = router;