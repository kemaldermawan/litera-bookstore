const User = require('../models/User');

exports.getLogin = (req, res) => {
    try {
        const deleted = req.query.deleted || undefined;
        const loggedOut = req.query.logged_out || undefined;
        const error = req.query.error || null;

        res.render('pages/login', { 
            pageTitle: 'Sign In - Litera Bookstore',
            deleted, 
            loggedOut,
            error,
            email: ''
        });
    } catch (err) {
        console.error('Error rendering login view:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('pages/login', { 
                pageTitle: 'Sign In - Litera Bookstore',
                error: 'Invalid email address or password configuration.', 
                email,
                deleted: undefined,
                loggedOut: undefined
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('pages/login', { 
                pageTitle: 'Sign In - Litera Bookstore',
                error: 'Invalid email address or password configuration.', 
                email,
                deleted: undefined,
                loggedOut: undefined
            });
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            phone: user.phone,
            address: user.address,
            bio: user.bio,
            profilePicture: user.profilePicture
        };

        req.session.success = `Welcome back, ${user.username}!`;

        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        }
        
        res.redirect('/store');
    } catch (err) {
        console.error('Critical login processing failure:', err);
        return res.status(500).send('Internal Server Error');
    }
};

exports.getRegister = (req, res) => {
    try {
        res.render('pages/register', { 
            pageTitle: 'Create Account - Litera Bookstore',
            error: null 
        });
    } catch (err) {
        console.error('Error rendering registration view:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.postRegister = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render('pages/register', { 
                pageTitle: 'Create Account - Litera Bookstore',
                error: 'Email address or username is already registered within our system.' 
            });
        }

        const newUser = new User({ 
            username, 
            email, 
            password, 
            phone,
            address: { street: '', city: '', province: '', postalCode: '' }
        });
        
        await newUser.save();

        req.session.user = {
            id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            role: 'user',
            phone: newUser.phone,
            address: newUser.address,
            bio: newUser.bio,
            profilePicture: newUser.profilePicture
        };

        req.session.success = 'Account created successfully! Welcome to Litera Bookstore.';
        res.redirect('/store');
    } catch (err) {
        console.error('Critical registration operational failure:', err);
        res.render('pages/register', { 
            pageTitle: 'Create Account - Litera Bookstore',
            error: 'An internal error occurred during your registration setup.' 
        });
    }
};

exports.logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error logging out user session context:', err);
                return res.redirect('/store');
            }
            res.clearCookie('connect.sid');
            res.redirect('/auth/login?logged_out=true');
        });
    } catch (err) {
        console.error('Logout handler configuration failure:', err);
        res.redirect('/store');
    }
};