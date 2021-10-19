const express = require('express');
const router = express.Router();

const {
    createProject,
    getProjects,
    getPageOneDraft,
    updatePageOneDraft,
    deleteProject
} = require('../controllers/product.controller.js');

router.post('/createproject', createProject);

router.put('/updatepageone', updatePageOneDraft);

router.delete('/deleteproject', deleteProject);

router.get('/getprojects', getProjects);
router.get('/getpageone', getPageOneDraft);

module.exports = router;