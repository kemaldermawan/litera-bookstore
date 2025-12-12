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

        // RENDER halaman dengan data user dan orders
        res.render('pages/profile', {
            user: user, 
            orders: orders // <-- DATA RIWAYAT TRANSAKSI
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


