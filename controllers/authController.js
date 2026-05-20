const User = require('../models/User');

/**
 * Render the Login page interface.
 * Captures query notifications regarding account deletion or logging out.
 */
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

/**
 * Handle user authentication verification processing.
 * Verifies identity credentials against the MongoDB deployment.
 */
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by administrative system unique email entry parameters
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

        // Execute cryptographic bcrypt hash comparison parameters checking
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

        // Establish secure payload data parameters inside the Express Session state
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

        // Cache dynamic notification messaging to display on successful layout landing
        req.session.success = `Welcome back, ${user.username}!`;

        // Direct paths processing based on user administrative access rights setting
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        }
        
        res.redirect('/store');
    } catch (err) {
        console.error('Critical login processing failure:', err);
        return res.status(500).send('Internal Server Error');
    }
};

/**
 * Render the registration interface layout.
 */
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

/**
 * Process new customer creation registration sequences.
 */
exports.postRegister = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Perform transactional validation check to enforce credential uniqueness
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render('pages/register', { 
                pageTitle: 'Create Account - Litera Bookstore',
                error: 'Email address or username is already registered within our system.' 
            });
        }

        // Build new structural User instances model placeholder state
        const newUser = new User({ 
            username, 
            email, 
            password, 
            phone,
            address: { street: '', city: '', province: '', postalCode: '' }
        });
        
        await newUser.save();

        // Autologin structural setup integration following success verification parameters
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

/**
 * Terminate current user authentication session state parameters.
 */
exports.logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error logging out user session context:', err);
                return res.redirect('/store');
            }
            res.clearCookie('connect.sid'); // Wipe system authorization tracking cookies
            res.redirect('/auth/login?logged_out=true');
        });
    } catch (err) {
        console.error('Logout handler configuration failure:', err);
        res.redirect('/store');
    }
};