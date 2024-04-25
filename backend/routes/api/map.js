const router = require('express').Router();
const { googleMapsAPIKey } = require('../../config');

router.post('/key', (req, res) => {
    console.log(googleMapsAPIKey)
    console.log('googleMapsAPIKey', googleMapsAPIKey);
    res.json({ googleMapsAPIKey: googleMapsAPIKey});
});

module.exports = router;