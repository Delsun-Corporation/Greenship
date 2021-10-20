const express = require('express');
const router = express.Router();

const {
    createProject,
    getProjects,
    deleteProject,
} = require('../controllers/project_controller/product.controller');

const {
    getPageOneDraft,
    updatePageOneDraft,
} = require('../controllers/project_controller/pageOne.controller');

const {
    getPageTwoDraft,
    updatePageTwoDraft
} = require('../controllers/project_controller/pageTwo.controller')

router.post('/createproject', createProject);

router.put('/updatepageone', updatePageOneDraft);
router.put('/updatepagetwo', updatePageTwoDraft);

router.delete('/deleteproject', deleteProject);

router.get('/getprojects', getProjects);
router.get('/getpageone', getPageOneDraft);
router.get('/getpagetwo', getPageTwoDraft);

module.exports = router;