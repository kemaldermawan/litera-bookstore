const User = require('../models/User');
const Order = require('../models/Order'); 

exports.getProfile = async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        // Ambil data user lengkap dari DB (penting untuk address yang up-to-date)
        const user = await User.findById(userId).lean();
        
        if (!user) {
            // Jika user tidak ditemukan (meskipun ada di sesi)
            return res.redirect('/login');
        }
        
        // Ambil riwayat transaksi user
        const orders = await Order.find({ user: userId })
            // Populate detail buku (title, coverImage) untuk setiap item di order
            .populate('items.book', 'title coverImage') 
            // Urutkan dari yang terbaru
            .sort({ createdAt: -1 })
            .lean(); 

        // Ambil pesan sukses dari session jika ada
        const success = req.session ? req.session.success : null;
        if (req.session && success) delete req.session.success;

        // RENDER halaman dengan data user dan orders
        res.render('pages/profile', {
            user: user, 
            orders: orders, // <-- DATA RIWAYAT TRANSAKSI
            success: success || null
        });
        
    } catch (err) {
        console.error('Error loading profile:', err);
        // Fallback jika terjadi error server
        res.render('pages/profile', { user: req.session.user, orders: [] });
    }
};

exports.updateAddress = async (req, res) => {

    if (!req.session.user) return res.redirect('/login');

    const { street, city, province, postalCode } = req.body;

    // Tambahkan pengamanan untuk address jika belum ada
    const addressData = { 
        street: street || '', 
        city: city || '', 
        province: province || '', 
        postalCode: postalCode || '' 
    };

    const updatedUser = await User.findByIdAndUpdate(
        req.session.user.id,
        { address: addressData },
        { new: true }
    );

    // Update sesi dengan data address terbaru
    req.session.user.address = updatedUser.address;

    // Perlu me-redirect ke /profile agar getProfile dipanggil ulang dengan data terbaru
    res.redirect('/profile');
};

exports.deleteAccount = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');

        const userId = req.session.user.id;

        // Hapus user dari database
        await User.findByIdAndDelete(userId);

        // Destroy session dan set pesan
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ success: false, message: 'Gagal menghapus akun' });
            }

            // Redirect ke login dengan pesan sukses
            res.redirect('/login?deleted=true');
        });

    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ success: false, message: 'Gagal menghapus akun' });
    }
};

exports.getEditProfile = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');

        const userId = req.session.user.id;
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.redirect('/login');
        }

        res.render('pages/edit-profile', {
            user: user
        });

    } catch (err) {
        console.error('Error loading edit profile:', err);
        res.redirect('/profile');
    }
};

exports.postEditProfile = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');

        const userId = req.session.user.id;
        console.log('postEditProfile called for user:', userId);
        console.log('req.file:', req.file);
        const { bio } = req.body;

        const updateData = {
            bio: bio || ''
        };

        // Handle file upload jika ada
        if (req.file) {
            updateData.profilePicture = '/img/profiles/' + req.file.filename;
            try {
                const fs = require('fs');
                const savedPath = 'public/img/profiles/' + req.file.filename;
                const exists = fs.existsSync(savedPath);
                console.log('Expected saved file path:', savedPath, 'exists:', exists);
            } catch (e) {
                console.error('Error checking saved file:', e);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        // Update session dengan data baru
        req.session.user.bio = updatedUser.bio;
        req.session.user.profilePicture = updatedUser.profilePicture;

        // Set success message dan redirect ke profile
        req.session.success = 'Profil berhasil diperbarui!';
        res.redirect('/profile');

    } catch (err) {
        console.error('Error updating profile:', err);
        const user = await User.findById(req.session.user.id).lean();
        res.render('pages/edit-profile', {
            user: user,
            error: 'Gagal memperbarui profil'
        });
    }
};


