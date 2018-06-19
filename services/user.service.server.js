module.exports = function (app) {
    app.get('/api/user', findAllUsers);
    app.get('/api/user/:userId', findUserById);
    app.post('/api/user', createUser);
    app.get('/api/profile', profile);
    app.post('/api/logout', logout);
    app.post('/api/login', login);
    app.put('/api/updateUser', updateUser);

    var userModel = require('../models/user/user.model.server');

    function login(req, res) {
        var credentials = req.body;
        userModel
            .findUserByCredentials(credentials)
            .then(function (user) {
                if(!user){
                    res.status(401).json({
                        "success": false,
                        "message" : "User Not Found With Given Credentials"
                    });
                } else {
                    req.session['currentUser'] = user;
                    res.json(user);
                }
            })
    }

    function logout(req, res) {
        req.session.destroy();
        res.send(200);
    }

    function findUserById(req, res) {
        var id = req.params['userId'];
        userModel.findUserById(id)
            .then(function (user) {
                res.json(user);
            })
    }

    function profile(req, res) {
        userModel.findUserById(req.session['currentUser']['_id'])
            .then((user)=> res.send(user));
    }

    function createUser(req, res) {
        var user = req.body;

        userModel
            .findUserByCredentials({username:user.username})
            .then(function (dbUser) {
                if(!dbUser) {
                    userModel.createUser(user)
                        .then(function (newUser) {
                            req.session['currentUser'] = newUser;
                            res.send(newUser);
                        })
                } else {
                    res.status(401).json({
                        "success": false,
                        "message" : "Username already exists"
                    });
                }
            });
    }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                res.send(users);
            })
    }

    function updateUser(req,res) {
        var userDetails = req.body;
        userModel.updateUser(userDetails)
            .then(user => res.send(user));
    }
}
