
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('webhooks page');
});



module.exports = router;