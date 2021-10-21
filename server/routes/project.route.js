const express = require('express');
const router = express.Router();

const {
    createProject,
    getProjects,
    deleteProject,
    getLastPage,
    postLastPage
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
router.post('/postlastpage', postLastPage);

router.put('/updatepageone', updatePageOneDraft);
router.put('/updatepagetwo', updatePageTwoDraft);

router.delete('/deleteproject', deleteProject);

router.get('/getprojects', getProjects);
router.get('/getpageone', getPageOneDraft);
router.get('/getpagetwo', getPageTwoDraft);
router.get('/getlastpage', getLastPage);

module.exports = router;