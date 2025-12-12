const User = require('../models/User');

exports.getLogin = (req, res) => {
    const deleted = req.query.deleted || undefined;
    const loggedOut = req.query.logged_out || undefined;
    res.render('pages/login', { deleted, loggedOut });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.render('pages/login', { error: 'User tidak ditemukan', email });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.render('pages/login', { error: 'Password salah', email });

    req.session.user = {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        phone: user.phone,
        address: user.address
    };

    req.session.success = `Selamat datang kembali, ${user.username}!`;

    if (user.role === 'admin') {
        return res.redirect('/admin/books');
    }

    res.redirect('/store');
};

exports.getRegister = (req, res) => {
    res.render('pages/register');
};

exports.postRegister = async (req, res) => {
    const { username, email, password, phone } = req.body;

    try {
        const newUser = new User({ username, email, password, phone });
        await newUser.save();

        req.session.user = {
            id: newUser._id,
            email,
            username,
            role: 'user',
            phone: newUser.phone,
            address: newUser.address
        };

        req.session.success = `Salam hangat, pengunjung baru 👐😇`;
        res.redirect('/store');
    } catch (err) {
        res.render('pages/register', { error: 'Email atau username sudah terpakai' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login?logged_out=true');
    });
};
