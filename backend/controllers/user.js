const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, )
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid authentication credentials!'
          })
        })
    })
}

exports.userLogin = (req, res, next) => {
  let _user;
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      _user = user;
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      const token = jwt.sign({
          email: _user.email,
          userId: _user._id
        },
        process.env.JWT_KEY, {
          expiresIn: '1h'
        });
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: _user._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!'
      })
    })
}
