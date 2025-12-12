<%- include('../partials/navbar') %>

<div class="container mt-4">
    <h1 class="mb-4">Profil Saya</h1>

    <% if (typeof success !== "undefined" && success) { %>
        <div id="popup-alert" class="popup-alert" style="background: #27ae60;">
            <%= success %>
        </div>
        <style>
            .popup-alert {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #27ae60;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                font-weight: 600;
                z-index: 9999;
                opacity: 0;
                animation: fadeInOut 3s ease forwards;
            }

            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                10% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        </style>
        <script>
            setTimeout(() => {
                const p = document.getElementById('popup-alert');
                if (p) p.remove();
            }, 3200);
        </script>
    <% } %>
    
    <div class="card mb-4">
        <div class="card-body">
            <div class="text-center mb-4">
                <img src="<%= user.profilePicture %>" alt="Profile Picture" class="rounded-circle" style="width: 120px; height: 120px; object-fit: cover; border: 3px solid #ddd;">
            </div>

            <h5 class="card-title text-center mb-4">Informasi Akun</h5>
            <p><strong>Username:</strong> <%= user.username %></p>
            <p><strong>Email   :</strong> <%= user.email %></p>
            <p><strong>No. HP  :</strong> <%= user.phone || '-' %></p>
            
            <% if (user.bio) { %>
                <p><strong>Bio:</strong></p>
                <p class="text-muted"><%= user.bio %></p>
            <% } %>
            
            <hr>
            <div class="d-flex gap-2">
                <a href="/profile/edit" class="btn btn-primary rounded-pill">Edit Profil</a>
                <a href="/logout" class="btn btn-danger rounded-pill btn-logout">Logout</a>
                <button type="button" class="btn btn-outline-danger rounded-pill" data-bs-toggle="modal" data-bs-target="#deleteAccountModal">
                    Hapus Akun
                </button>
            </div>
        </div>
    </div>

    <div class="card mb-4">
        <div class="card-body">
            <h5 class="card-title">Alamat Pengiriman Utama</h5>
            <form action="/profile/update-address" method="POST">
                <div class="mb-3">
                    <label for="street" class="form-label">Jalan</label>
                    <input type="text" id="street" name="street" class="form-control" value="<%= user.address ? user.address.street || '' : '' %>">
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="city" class="form-label">Kota</label>
                        <input type="text" id="city" name="city" class="form-control" value="<%= user.address ? user.address.city || '' : '' %>">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="province" class="form-label">Provinsi</label>
                        <input type="text" id="province" name="province" class="form-control" value="<%= user.address ? user.address.province || '' : '' %>">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="postalCode" class="form-label">Kode Pos</label>
                        <input type="text" id="postalCode" name="postalCode" class="form-control" value="<%= user.address ? user.address.postalCode || '' : '' %>">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary rounded-pill">Simpan Alamat</button>
            </form>
        </div>
    </div>

    <h3 class="mb-3">Riwayat Transaksi</h3>

    <% if (orders && orders.length > 0) { %>
        <% orders.forEach(order => { %>
            <div class="card mb-4 shadow-sm">
                <div class="card-header d-flex flex-wrap justify-content-between">
                    <div>
                        <strong>Pesanan ID:</strong> <small class="text-muted"><%= order._id %></small>
                    </div>
                    <div>
                        <strong>Tanggal:</strong> 
                        <%= new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) %>
                    </div>
                </div>
                
                <div class="card-body p-0">
                    <ul class="list-group list-group-flush">
                        
                        <% order.items.forEach(item => { %>
                            <li class="list-group-item d-flex align-items-center py-3">
                                
                                <% if (item.book) { %>
                                    <img src="<%= item.book.coverImage %>" alt="<%= item.book.title %>" style="width: 50px; height: 75px; object-fit: cover; margin-right: 15px;">
                                    
                                    <div class="me-auto">
                                        <strong><%= item.book.title %></strong>
                                        <br>
                                        <small class="text-muted">Qty: <%= item.quantity %>, Harga Satuan: Rp <%= item.priceAtPurchase.toLocaleString('id-ID') %></small>
                                    </div>
                                    
                                    <div class="ms-3 text-end">
                                        <% 
                                            // Asumsi: Status order disetel 'Selesai' di backend
                                            const canReview = order.status === 'Selesai' || !order.status; 
                                            // TODO: Tambahkan logika cek apakah item ini sudah diulas
                                            const isReviewed = false; // Ganti dengan logika sebenarnya
                                        %>
                                        
                                        <% if (isReviewed) { %>
                                            <button class="btn btn-sm btn-success rounded-pill" disabled>Sudah Diulas</button>
                                        <% } else if (canReview) { %>
                                            <a href="/review/new/<%= item.book._id %>" class="btn btn-sm btn-primary rounded-pill text-white">
                                                Tulis Ulasan
                                            </a>
                                        <% } %>
                                    </div>
                                <% } else { %>
                                    <div class="text-danger">Item tidak valid atau buku telah dihapus.</div>
                                <% } %>
                            </li>
                        <% }) %>
                    </ul>
                </div>

                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Status:</strong>
                        <% 
                            const status = 'Selesai'; 
                            let statusClass = 'bg-secondary';
                            if (status === 'Selesai') statusClass = 'bg-success';
                            else if (status === 'Dibatalkan') statusClass = 'bg-danger';
                            else if (status === 'Pending' || status === 'Baru') statusClass = 'bg-warning text-dark';
                        %>
                        <span class="badge <%= statusClass %>"><%= status %></span>
                    </div>
                    <h5 class="mb-0">Total: <span class="text-primary fw-bold">Rp <%= order.totalPrice.toLocaleString('id-ID') %></span></h5>
                </div>
            </div>
        <% }) %>
    <% } else { %>
        <div class="alert alert-info text-center">
            Anda belum memiliki riwayat transaksi. Ayo mulai berbelanja!
        </div>
    <% } %>

</div>

<!-- Modal Konfirmasi Hapus Akun -->
<div class="modal fade" id="deleteAccountModal" tabindex="-1" aria-labelledby="deleteAccountLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="deleteAccountLabel">Hapus Akun</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p><strong>Perhatian!</strong></p>
                <p>Anda akan menghapus akun secara permanen. Tindakan ini tidak dapat dibatalkan dan semua data akun Anda akan hilang.</p>
                <p class="text-muted">Apakah Anda yakin ingin melanjutkan?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                <form action="/profile/delete-account" method="POST" style="display: inline;">
                    <button type="submit" class="btn btn-danger">Ya, Hapus Akun</button>
                </form>
            </div>
        </div>
    </div>
</div>

<%- include('../partials/footer') %>
