const User = require('../models/User');

module.exports = {
    /**
     * Middleware to verify if the user is authenticated.
     * Redirects to the login page with an error if no session exists.
     */
    isLoggedIn(req, res, next) {
        try {
            if (!req.session || !req.session.user) {
                return res.redirect('/auth/login?error=You must be signed in to access this page.');
            }
            // Bind session user data to the request object for downstream controllers
            req.user = req.session.user;
            next();
        } catch (err) {
            console.error('Auth Middleware Error:', err);
            return res.redirect('/auth/login?error=Authentication error occurred.');
        }
    },

    /**
     * Middleware to verify if the authenticated user has administrative privileges.
     * Redirects to the store catalog if the user role is not 'admin'.
     */
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

    /**
     * Middleware to enforce profile completion before processing high-priority actions.
     * Requires valid contact details and structural geographical parameters.
     */
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