const express = require('express');
const router = express.Router();

const {
    createProject,
    getProjects,
    deleteProject,
    getLastPage
} = require('../controllers/project_controller/product.controller');

const {
    getPageOneDraft,
    updatePageOneDraft,
} = require('../controllers/project_controller/pageOne.controller');

const {
    getPageTwoDraft,
    updatePageTwoDraft
} = require('../controllers/project_controller/pageTwo.controller')

const {
    updatePageThreeDraft,
    getPageThreeDraft
} = require('../controllers/project_controller/pageThree.controller')

const {
    updatePageFourDraft,
    getPageFourDraft
} = require('../controllers/project_controller/pageFour.controller')

const {
    updatePageFiveDraft,
    getPageFiveDraft
} = require('../controllers/project_controller/pageFive.controller')

const  {
    getPageSixDraft
} = require('../controllers/project_controller/pageSix.controller')

router.post('/createproject', createProject);

router.put('/updatepageone', updatePageOneDraft);
router.put('/updatepagetwo', updatePageTwoDraft);
router.put('/updatepagethree', updatePageThreeDraft);
router.put('/updatepagefour', updatePageFourDraft);
router.put('/updatepagefive', updatePageFiveDraft);

router.delete('/deleteproject', deleteProject);

router.get('/getprojects', getProjects);
router.get('/getpageone', getPageOneDraft);
router.get('/getpagetwo', getPageTwoDraft);
router.get('/getlastpage', getLastPage);
router.get('/getpagethree', getPageThreeDraft);
router.get('/getpagefour', getPageFourDraft);
router.get('/getpagefive', getPageFiveDraft);
router.get('/getpagesix', getPageSixDraft);

module.exports = router;