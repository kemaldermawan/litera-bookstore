const User = require('../models/user');

exports.getProfile = async (req, res) => {
    const userSession = req.session.user;

    if (!userSession) return res.redirect('/login');

    try {
        const user = await User.findById(userSession.id);

        res.render('pages/profile', {
            user,
            needUpdate: req.query.need === 'complete-profile'
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};

exports.updateProfile = async (req, res) => {
    const userSession = req.session.user;
    if (!userSession) return res.redirect('/login');

    const { phone, street, city, province, postalCode } = req.body;

    try {
        const user = await User.findById(userSession.id);

        user.phone = phone;
        user.address = { street, city, province, postalCode };

        await user.save();

        // perbarui session
        req.session.user.phone = phone;
        req.session.user.address = user.address;

        res.redirect('/profile?updated=true');
    } catch (error) {
        console.log(error);
        res.render('pages/profile', { error: "Gagal memperbarui profil" });
    }
};
