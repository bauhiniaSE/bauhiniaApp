"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const usersRouter = express_1.Router();
usersRouter.get('/', (req, res) => {
    let users = [new User_1.default('Test User', 'One'), new User_1.default('Test User', 'Two')];
    res.render('usersList', { usersList: users });
});
usersRouter.get('/user', (req, res) => {
    if (typeof req.query.firstname !== 'undefined' && typeof req.query.lastname !== 'undefined') {
        let firstname = String(req.query.firstname);
        let lastname = String(req.query.lastname);
        let user = new User_1.default(firstname, lastname);
        res.render('userDetails', { user: user });
    }
    else {
        res.status(400).end();
    }
});
exports.default = usersRouter;
//# sourceMappingURL=UsersController.js.map