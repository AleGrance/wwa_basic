import express from 'express';

module.exports = app => {
    // Settings
    app.set('port', process.env.PORT || 3001);

    //middlewares
    app.use(express.json());
};