module.exports = function errorHandler(err, req, res, next) {
    console.error('Unhandled Server Error:', err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({
        OK: false,
        error: 'internal_server_error',
        message: 'Ha ocurrido un error en el servidor.'
    });
};
