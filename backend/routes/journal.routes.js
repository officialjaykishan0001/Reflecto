const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const journalController = require("../controllers/journal.controller");


router.post('/create', authMiddleware.authUser, journalController.createJournal);
router.get('/get', authMiddleware.authUser, journalController.getJournals);
router.get('/get/:id', authMiddleware.authUser, journalController.getJournal);
router.put('/update/:id', authMiddleware.authUser, journalController.updateJournal);
router.delete('/delete/:id', authMiddleware.authUser, journalController.deleteJournal);



module.exports = router;