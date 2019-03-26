const router = require("express").Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../../documentation.json');

router.use("/", require("./users"));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use(function(err, req, res, next) {
    if (err.name === "ValidationError") {
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce(function(errors, key) {
                errors[key] = err.errors[key].message;
                return errors;
            }, {})
        });
    }

    return next(err);
});

module.exports = router;
