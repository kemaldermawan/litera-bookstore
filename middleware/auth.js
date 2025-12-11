const User = require('../models/User');

module.exports = {
    isLoggedIn(req, res, next) {
        try {
            if (!req.session || !req.session.user) {
              return res.redirect('/login');
            }
            req.user = req.session.user; // cukup pakai data session
            next();
          } catch (err) {
            console.error('Auth middleware error', err);
            return res.redirect('/login');
          }
        },
      
    isAdmin(req, res, next) {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.redirect('/');
        }
        next();
    },

    mustCompleteProfile(req, res, next) {
        const user = req.session.user;
        if (!user) return res.redirect('/login');

        const phoneOK = user.phone && user.phone.trim() !== "";
        const addressOK = user.address && user.address.city;

        if (!phoneOK || !addressOK) {
            return res.redirect('/profile?need=complete-profile');
        }

        next();
    }
};
