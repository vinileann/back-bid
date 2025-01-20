//2 casos
exports.get404 = (req, res, next) => {
    const error = new Error('Não encontrado.');
    error.statusCode = 404;
    next(error);
};
exports.get500 = (error, req, res, next) => {
    const data = error.data; //isso é um erro q é baseado no dado
    res.status(error.statusCode || 500);
    res.json({
        error: {
            message: error.message,
            data: data,
        },
    });
};