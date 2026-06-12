const User = require('../models/User');

module.exports = {

    isLoggedIn(req, res, next) {
        try {
            if (!req.session || !req.session.user) {
                return res.redirect('/auth/login?error=You must be signed in to access this page.');
            }
            req.user = req.session.user;
            next();
        } catch (err) {
            console.error('Auth Middleware Error:', err);
            return res.redirect('/auth/login?error=Authentication error occurred.');
        }
    },

    isAdmin(req, res, next) {
        try {
            if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
                return res.redirect('/store?error=Access denied. Administrative privileges required.');
            }
            next();
        } catch (err) {
            console.error('Admin Middleware Error:', err);
            return res.redirect('/store?error=Authorization error occurred.');
        }
    },

    mustCompleteProfile(req, res, next) {
        try {
            const user = req.session.user;
            if (!user) {
                return res.redirect('/auth/login');
            }

            const hasPhone = user.phone && user.phone.trim() !== "";
            const hasCity = user.address && user.address.city && user.address.city.trim() !== "";

            if (!hasPhone || !hasCity) {
                return res.redirect('/auth/profile?notification=complete_profile_required');
            }
            next();
        } catch (err) {
            console.error('Profile Validation Middleware Error:', err);
            return res.redirect('/auth/profile?error=Profile validation failed.');
        }
    }
};