const User = require('../models/User');

exports.getProfile = (req, res) => {
    res.render('pages/profile', { user: req.session.user });
};

exports.updateAddress = async (req, res) => {

    if (!req.session.user) return res.redirect('/login');

    const { street, city, province, postalCode } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.session.user.id,
        { address: { street, city, province, postalCode } },
        { new: true }
    );

    req.session.user.address = updatedUser.address;

    res.redirect('/profile');
};


