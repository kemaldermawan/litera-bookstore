module.exports = {
    isLoggedIn(req, res, next) {
        if (!req.session.user) return res.redirect('/login');
        next();
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
