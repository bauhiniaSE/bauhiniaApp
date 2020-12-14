"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const usersRouter = express_1.Router();
usersRouter.get('/', (req, res) => {
    const users = [new User_1.default('Test User', 'One'), new User_1.default('Test User', 'Two')];
    res.render('usersList', { usersList: users });
});
usersRouter.get('/user', (req, res) => {
    if (typeof req.query.firstname !== 'undefined' && typeof req.query.lastname !== 'undefined') {
        const firstname = String(req.query.firstname);
        const lastname = String(req.query.lastname);
        const user = new User_1.default(firstname, lastname);
        res.render('userDetails', { user: user });
    }
    else {
        res.status(400).end();
    }
});
exports.default = usersRouter;
//# sourceMappingURL=UsersController.js.map