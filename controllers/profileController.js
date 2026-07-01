const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const user = await User.findById(userId).lean();
        if (!user) {
            return res.redirect('/auth/login?error=Session invalid. User account not found.');
        }

        const orders = await Order.find({ user: userId })
            .populate('items.book', 'title coverImage')
            .sort({ createdAt: -1 })
            .lean();

        const userReviews = await Review.find({ user: userId }).select('book').lean();
        const reviewedBookIds = userReviews.map(review => review.book.toString());

        const success = req.query.success || (req.session ? req.session.success : null);
        if (req.session && req.session.success) {
            delete req.session.success;
        }

        const notification = req.query.notification || null;

        res.render('pages/profile', {
            pageTitle: `${user.username}'s Profile - Litera Bookstore`,
            user,
            orders,
            reviewedBookIds,
            success,
            notification
        });
    } catch (err) {
        console.error('Critical profile view retrieval failure:', err);
        res.render('pages/profile', { 
            pageTitle: 'Profile - Litera Bookstore',
            user: req.session.user, 
            orders: [],
            reviewedBookIds: [],
            success: null,
            notification: 'Error loading structural history data.'
        });
    }
};

exports.getEditProfile = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const user = await User.findById(req.session.user.id).lean();
        if (!user) {
            return res.redirect('/auth/login');
        }

        res.render('pages/editProfile', {
            pageTitle: 'Edit Profile - Litera Bookstore',
            user,
            error: null
        });
    } catch (err) {
        console.error('Error loading edit profile workspace:', err);
        res.redirect('/auth/profile');
    }
};

exports.postEditProfile = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const { bio, phone, address } = req.body;
        const userId = req.session.user.id;

        const updateData = { 
            bio: bio || '',
            phone: phone || '',
            address: {
                street: (address && address.street) ? address.street : '',
                city: (address && address.city) ? address.city : '',
                postalCode: (address && address.postalCode) ? address.postalCode : ''
            }
        };

        if (req.file) {
            updateData.profilePicture = `/img/profiles/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).lean();

        req.session.user = {
            id: updatedUser._id,
            email: updatedUser.email,
            username: updatedUser.username,
            role: updatedUser.role,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture,
            address: updatedUser.address
        };

        res.redirect('/auth/profile?success=Profile and logistical records updated successfully.');
    } catch (err) {
        console.error('Critical profile edit database operation error:', err);
        const user = await User.findById(req.session.user.id).lean();
        res.render('pages/editProfile', {
            pageTitle: 'Edit Profile - Litera Bookstore',
            user,
            error: 'Failed to apply configuration updates to your account.'
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const userId = req.session.user.id;

        await User.findByIdAndDelete(userId);

        req.session.destroy((err) => {
            if (err) {
                console.error('Critical operational session termination failure:', err);
                return res.status(500).json({ success: false, message: 'Failed to flush session tracking data.' });
            }
            res.clearCookie('connect.sid');
            res.redirect('/auth/login?deleted=' + encodeURIComponent('Your account has been permanently deleted.'));
        });
    } catch (err) {
        console.error('Account erasure runtime operational failure:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error handling profile deletion.' });
    }
};