
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/role.controller.js')

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', controller.store);

// router.get('/edit/:id', controller.edit);
// router.put('/edit/:id', controller.update);
// router.delete('/delete/:id', controller.delete);

module.exports = router;