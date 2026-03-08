const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/api/chat.controller.js');

router.post('/', chatController.chat);

module.exports = router;
