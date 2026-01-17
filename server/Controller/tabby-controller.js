const { createErrorResponse } = require('../Utils/error-handler');

exports.createPayment = async (req, res) => {
    return res.status(501).json(createErrorResponse(
        'Not Implemented',
        'Tabby payment integration is currently under development.',
        'NOT_IMPLEMENTED'
    ));
};
