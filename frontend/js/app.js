// Helper $ and show/hide
function $(id) { return document.getElementById(id); }
/**
 * Show an element.
 * - NAV elements should become flex so they keep their horizontal layout.
 * - Other elements default to 'block'.
 */
function show(el) {
  if (!el) return;
  try {
    const tag = (el.tagName || '').toUpperCase();
    if (tag === 'NAV') {
      el.style.display = 'flex';
      return;
    }
    const computed = window.getComputedStyle(el).display;
    if (computed && computed !== 'none') {
      el.style.display = '';
    } else {
      el.style.display = 'block';
    }
  } catch (e) {
    el.style.display = 'block';
  }
}

function hide(el) { if (el) el.style.display = 'none'; }

// API helper
async function api(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  
  return res.json();
}

/**
 * Giải mã Base64 URL
 */
function decodeBase64Url(base64Url) {
  try {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding === 2) base64 += '==';
    else if (padding === 3) base64 += '=';

    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Lỗi decode Base64 URL:", e);
    return null;
  }
}

// ========== TRANG CHỦ - SẢN PHẨM BÁN CHẠY ==========
async function showHome() {
  try {
    $('content').innerHTML = '<div class="loading">Đang tải sản phẩm...</div>';
    
    const data = await api('/san-pham-ban-chay', 'GET');
    
    if (!data || data.length === 0) {
      $('content').innerHTML = '<h2>Chưa có sản phẩm bán chạy</h2>';
      return;
    }
    
    show($('search-bar'));
    
    $('content').innerHTML = `
      <h2>Sản phẩm bán chạy</h2>
      <div class="grid">
        ${data.map(p => `
          <div class="card" onclick="showProductDetail(${p.id})">
            <img src="${p.anh || '/assets/images/placeholder.jpg'}" alt="${p.ten_san_pham}" class="thumb" onerror="this.src='/assets/images/placeholder.jpg'" />
            <h3>${p.ten_san_pham}</h3>
            <div class="meta">
              <span class="price">${formatPrice(p.gia_ban)}</span>
              ${p.gia_cu ? `<span class="old-price">${formatPrice(p.gia_cu)}</span>` : ''}
            </div>
            <p>${p.mo_ta ? p.mo_ta.substring(0, 50) + '...' : ''}</p>
            <div class="rating">★ ${p.so_sao_trung_binh || 0}/5 (${p.so_luot_mua || 0} lượt mua)</div>
            <button onclick="event.stopPropagation(); addToCart(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')" class="btn">
              Thêm vào giỏ
            </button>
            <button onclick="event.stopPropagation(); buyNow(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')" class="btn btn-buy-now">
              Mua ngay
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    console.error('Lỗi load sản phẩm:', err);
    $('content').innerHTML = '<h2>Không thể tải dữ liệu. Vui lòng kiểm tra kết nối API.</h2>';
  }
}

// ========== DANH MỤC (ĐÃ SỬA THEO JSON THỰC TẾ) ==========
async function showCategories() {
  try {
    $('content').innerHTML = '<div class="loading">Đang tải danh mục...</div>';
    hide($('search-bar'));
    
    const res = await api('/nhom-san-pham', 'GET');
    
    const cats = Array.isArray(res) ? res : (res?.data || []);
    
    if (cats.length === 0) {
      $('content').innerHTML = '<h2>Chưa có danh mục</h2>';
      return;
    }

    $('content').innerHTML = `
      <h2>Danh mục sản phẩm</h2>
      <div class="grid">
        ${cats.map(c => `
          <div class="card" onclick="showProducts(${c.id})">
            <img src="/assets/images/placeholder.jpg" 
                 alt="${c.Ten}" 
                 class="thumb" 
                 onerror="this.src='/assets/images/placeholder.jpg'" />
            <h3>${c.Ten}</h3>
            <p>${c.MoTa || ''}</p>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    console.error('Lỗi load danh mục:', err);
    $('content').innerHTML = '<h2>Không thể tải danh mục. Kiểm tra API.</h2>';
  }
}

// ========== SẢN PHẨM THEO NHÓM ==========
async function showProducts(nhomId) {
  try {
    $('content').innerHTML = '<div class="loading">Đang tải sản phẩm...</div>';
    hide($('search-bar'));
    
    const prods = await api(`/san-pham?nhom=${nhomId}`, 'GET');
    
    if (!prods || prods.length === 0) {
      $('content').innerHTML = `
        <h2>Sản phẩm trong nhóm</h2>
        <p>Chưa có sản phẩm trong nhóm này.</p>
        <button onclick="showCategories()">← Quay lại danh mục</button>
      `;
      return;
    }
    
    $('content').innerHTML = `
      <div style="margin-bottom: 1rem;">
        <button onclick="showCategories()">← Quay lại danh mục</button>
      </div>
      <h2>Sản phẩm</h2>
      <div class="grid">
        ${prods.map(p => `
          <div class="card" onclick="showProductDetail(${p.id})">
            <img src="${p.anh || '/assets/images/placeholder.jpg'}" alt="${p.ten_san_pham}" class="thumb" onerror="this.src='/assets/images/03Aoni.jpg'" />
            <h3>${p.ten_san_pham}</h3>
            <div class="meta">
              <span class="price">${formatPrice(p.gia_ban)}</span>
              ${p.gia_cu ? `<span class="old-price">${formatPrice(p.gia_cu)}</span>` : ''}
            </div>
            <p>${p.mo_ta ? p.mo_ta.substring(0, 50) + '...' : ''}</p>
            <div class="rating">★ ${p.so_sao_trung_binh || 0}/5 (${p.so_luot_mua || 0} lượt mua)</div>
            <button onclick="event.stopPropagation(); addToCart(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')" class="btn">
              Thêm vào giỏ
            </button>
            <button onclick="event.stopPropagation(); buyNow(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')" class="btn btn-buy-now">
              Mua ngay
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    console.error('Lỗi load sản phẩm:', err);
    $('content').innerHTML = '<h2>Không thể tải sản phẩm</h2>';
  }
}

// ========== CHI TIẾT SẢN PHẨM + ĐÁNH GIÁ ==========
async function showProductDetail(id) {
  try {
    const p = await api(`/san-pham/${id}`, 'GET');
    const avgRating = p.danh_gia.length > 0 ? (p.danh_gia.reduce((sum, d) => sum + d.so_sao, 0) / p.danh_gia.length).toFixed(1) : 0;
    
    $('content').innerHTML = `
      <div class="product-detail">
        <img src="${p.anh || '/assets/images/placeholder.jpg'}" alt="${p.ten_san_pham}" class="detail-img" onerror="this.src='/assets/images/placeholder.jpg'" />
        <div class="detail-info">
          <h2>${p.ten_san_pham}</h2>
          <div class="rating">★ ${avgRating}/5 (${p.danh_gia.length} đánh giá) - ${p.so_luot_mua || 0} lượt mua</div>
          <p>${p.mo_ta || ''}</p>
          <div class="price">${formatPrice(p.gia_ban)}</div>
          ${p.gia_cu ? `<div class="old-price">${formatPrice(p.gia_cu)}</div>` : ''}
          <button onclick="addToCart(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')">Thêm vào giỏ</button>
          <button onclick="buyNow(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')" class="btn-buy-now">Mua ngay</button>
        </div>
        
        <h3>Đánh giá</h3>
        <div class="reviews">
          ${p.danh_gia.map(d => `
            <div class="review-item">
              <span class="stars">★${'★'.repeat(d.so_sao - 1)}${'☆'.repeat(5 - d.so_sao)}</span>
              <p>${d.noi_dung}</p>
              <small>${formatDate(d.ngay_danh_gia)}</small>
            </div>
          `).join('') || '<p>Chưa có đánh giá nào.</p>'}
        </div>
        
        <h4>Đánh giá của bạn</h4>
        <select id="rating-stars">
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
        <textarea id="feedback" placeholder="Bình luận về sản phẩm..." rows="3"></textarea>
        <button onclick="submitFeedback(${p.id})" class="btn-primary">Gửi đánh giá</button>
      </div>
      <button onclick="showHome()" class="btn-secondary">Quay lại</button>
    `;
  } catch (err) {
    console.error('Lỗi load chi tiết:', err);
    $('content').innerHTML = '<h2>Không thể tải sản phẩm</h2>';
  }
}

async function submitFeedback(productId) {
  const so_sao = parseInt($('rating-stars').value);
  const noi_dung = $('feedback').value.trim();
  if (!noi_dung || so_sao < 1 || so_sao > 5) {
    alert('Chọn sao 1-5 và viết bình luận!');
    return;
  }
  
  try {
    const hasBought = await api(`/check-mua/${productId}`, 'GET');
    if (!hasBought || hasBought.count === 0) {
      alert('Bạn chưa mua sản phẩm này, không thể đánh giá!');
      return;
    }
  } catch (err) {
    console.error('Check mua lỗi:', err);
  }
  
  const res = await api('/danh-gia', 'POST', { san_pham_id: productId, so_sao, noi_dung });
  if (res.success) {
    alert('Đánh giá thành công! Cập nhật ★' + so_sao);
    showProductDetail(productId);
  } else {
    alert('Lỗi gửi: ' + res.error);
  }
}

// ========== ĐƠN HÀNG CỦA USER ==========
async function showMyOrders() {
  if (!token) { 
    alert('Chưa đăng nhập!'); 
    return; 
  }
  
  $('content').innerHTML = '<div class="loading">Đang tải...</div>';
  hide($('search-bar'));
  
  try {
    const payload = token.split('.')[1];
    const decoded = decodeBase64Url(payload);
    const userId = decoded.id;
    
    const response = await fetch(`/api/don-hang/${userId}`, { method: 'GET' });
    if (!response.ok) throw new Error(response.statusText);
    
    const orders = await response.json();
    
    if (!orders || orders.length === 0) {
      $('content').innerHTML = `
        <h2>Đơn hàng của bạn</h2>
        <p>Chưa có đơn hàng nào.</p>
        <button onclick="showHome()" 
                style="padding: 1.3rem 2rem; background: #e0e0e0; color: #333; border: none; border-radius: 15px; cursor: pointer; font-size: 1.1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
          Tiếp tục mua sắm
        </button>
      `;
      return;
    }
    
    $('content').innerHTML = `
      <h2>Đơn hàng của bạn (${orders.length} đơn)</h2>
      <div class="orders-list">
        ${orders.map(o => `
          <div class="order-card">
            <div class="order-header">
              <strong>Đơn #${o.id}</strong>
              <span class="status status-${o.trang_thai}">${formatStatus(o.trang_thai)}</span>
            </div>
            <div class="order-products">
              ${o.chi_tiet && o.chi_tiet.length
                ? o.chi_tiet.map((p, idx) => `
                    <div class="product-line" style="margin: 6px 0; padding: 6px; border: 1px solid #eee; border-radius: 6px;">
                      <p><strong>Sản phẩm ${idx + 1}:</strong> ${p.ten_san_pham || 'Sản phẩm #' + p.san_pham_id}</p>
                      <p><strong>Số lượng:</strong> ${p.so_luong}</p>
                      <p><strong>Giá:</strong> ${formatPrice(p.gia_luc_mua)}</p>
                    </div>
                  `).join('')
                : '<em>Chưa có chi tiết sản phẩm.</em>'
              }
            </div>
            ${o.trang_thai === 'da_giao' ? `<button onclick="showFeedbackFormForOrder(${o.id})" class="btn-primary">Đánh giá</button>` : ''}
          </div>
        `).join('')}
      </div>
      <button onclick="showHome()" class="btn-secondary">Quay lại</button>
    `;
  } catch (err) {
    console.error('Lỗi load đơn:', err);
    $('content').innerHTML = `
      <h2>Đơn hàng của bạn</h2>
      <p>Lỗi tải đơn. Thử lại.</p>
      <button onclick="showMyOrders()" class="btn-secondary">Thử lại</button>
    `;
  }
}

async function showFeedbackFormForOrder(orderId) {
  $('content').innerHTML = '<div class="loading">Đang tải chi tiết...</div>';
  
  try {
    const data = await api(`/chi-tiet-don-hang/${orderId}`, 'GET');
    if (!data || !data.chi_tiet || data.chi_tiet.length === 0) {
      $('content').innerHTML = '<p>Không có chi tiết đơn hàng.</p>';
      return;
    }

    $('content').innerHTML = `
      <h2>Đánh giá đơn hàng #${data.don_hang_id}</h2>
      <div class="feedback-form">
        ${data.chi_tiet.map(p => `
          <div class="feedback-product" style="border-bottom:1px solid #eee; padding:10px 0;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
              <img src="${p.anh || '/assets/images/placeholder.jpg'}" alt="${p.ten_san_pham}" style="width:80px;height:80px;object-fit:cover;border-radius:4px;" onerror="this.src='/assets/images/placeholder.jpg'" />
              <div>
                <h4 style="margin:0 0 5px 0;">${p.ten_san_pham}</h4>
                <p style="margin:0;color:#666;">Số lượng: ${p.so_luong} | Giá: ${formatPrice(p.gia_luc_mua)}</p>
                <p style="margin:5px 0 0 0;font-weight:bold;">Thành tiền: ${formatPrice(p.thanh_tien)}</p>
              </div>
            </div>
            <label>Chọn số sao:</label>
            <select id="rating-${p.san_pham_id}" style="padding:8px;width:100%;max-width:200px;">
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
            <textarea id="feedback-${p.san_pham_id}" placeholder="Nhận xét của bạn..." rows="3" style="width:100%;margin-top:6px;padding:8px;"></textarea>
            <button onclick="submitFeedback(${p.san_pham_id}, ${data.don_hang_id})" 
                    id="btn-${p.san_pham_id}"
                    class="btn-primary" style="margin-top:6px;">
              Gửi đánh giá
            </button>
            <span id="status-${p.san_pham_id}" style="margin-left:10px;color:#28a745;"></span>
          </div>
        `).join('')}
      </div>
      <button onclick="showMyOrders()" class="btn-secondary" style="margin-top:10px;">Quay lại</button>
    `;
  } catch (err) {
    console.error('Lỗi tải chi tiết đơn:', err);
    $('content').innerHTML = `<p>Lỗi tải đơn hàng.</p><button onclick="showMyOrders()" class="btn-secondary">Quay lại</button>`;
  }
}

async function submitFeedback(productId, orderId) {
  const ratingSelect = $(`rating-${productId}`);
  const feedbackTextarea = $(`feedback-${productId}`);
  const submitBtn = $(`btn-${productId}`);
  const statusSpan = $(`status-${productId}`);
  
  if (!ratingSelect || !feedbackTextarea) return;
  
  const so_sao = parseInt(ratingSelect.value);
  const noi_dung = feedbackTextarea.value.trim();

  if (!noi_dung || noi_dung.length < 5) {
    alert('Nhập nội dung đánh giá (ít nhất 5 ký tự)!');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi...';
  }

  try {
    const payload = token.split('.')[1];
    const tokenData = decodeBase64Url(payload);
    const userId = tokenData.id;

    const res = await fetch(`/api/danh-gia-don/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ san_pham_id: productId, nguoi_dung_id: userId, so_sao, noi_dung }),
    });

    const result = await res.json();
    
    if (res.ok && result.success) {
      if (statusSpan) statusSpan.textContent = 'Đã gửi!';
      alert('Cảm ơn bạn đã đánh giá!');
      ratingSelect.disabled = true;
      feedbackTextarea.disabled = true;
      if (submitBtn) {
        submitBtn.textContent = 'Đã đánh giá';
        submitBtn.style.background = '#6c757d';
      }
    } else {
      throw new Error(result.error || 'Không thể gửi');
    }
  } catch (err) {
    console.error('Lỗi gửi đánh giá:', err);
    alert('Không gửi được: ' + err.message);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gửi đánh giá';
    }
  }
}

// ========== TÌM KIẾM ==========
async function doSearch() {
  const q = $('search-input').value.trim();
  try {
    $('content').innerHTML = '<div class="loading">Đang tìm kiếm...</div>';
    
    let res;
    if (!q) {
      res = await api('/san-pham', 'GET');
      $('content').innerHTML = `
        <h2>Tất cả sản phẩm</h2>
        <div class="grid">
          ${res.map(p => `
            <div class="card" onclick="showProductDetail(${p.id})">
              <img src="${p.anh || '/assets/images/placeholder.jpg'}" alt="${p.ten_san_pham}" class="thumb" onerror="this.src='/assets/images/placeholder.jpg'" />
              <h3>${p.ten_san_pham}</h3>
              <div class="meta">
                <span class="price">${formatPrice(p.gia_ban)}</span>
                ${p.gia_cu ? `<span class="old-price">${formatPrice(p.gia_cu)}</span>` : ''}
              </div>
              <p>${p.mo_ta ? p.mo_ta.substring(0, 50) + '...' : ''}</p>
              <div class="rating">★ ${p.so_sao_trung_binh || 0}/5 (${p.so_luot_mua || 0} lượt mua)</div>
              <button onclick="event.stopPropagation(); addToCart(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')">
                Thêm vào giỏ
              </button>
              <button onclick="event.stopPropagation(); buyNow(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')" class="btn-buy-now">
                Mua ngay
              </button>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      res = await api(`/tim-kiem?q=${encodeURIComponent(q)}`, 'GET');
      if (!res || res.length === 0) {
        $('content').innerHTML = `<h2>Kết quả tìm kiếm: "${q}"</h2><p>Không tìm thấy sản phẩm nào.</p>`;
        return;
      }
      $('content').innerHTML = `
        <h2>Kết quả: "${q}"</h2>
        <div class="grid">
          ${res.map(p => `
            <div class="card" onclick="showProductDetail(${p.id})">
              <img src="${p.anh || '/assets/images/placeholder.jpg'}" alt="${p.ten_san_pham}" class="thumb" onerror="this.src='/assets/images/placeholder.jpg'" />
              <h3>${p.ten_san_pham}</h3>
              <div class="meta">
                <span class="price">${formatPrice(p.gia_ban)}</span>
                ${p.gia_cu ? `<span class="old-price">${formatPrice(p.gia_cu)}</span>` : ''}
              </div>
              <p>${p.mo_ta ? p.mo_ta.substring(0, 50) + '...' : ''}</p>
              <div class="rating">★ ${p.so_sao_trung_binh || 0}/5 (${p.so_luot_mua || 0} lượt mua)</div>
              <button onclick="event.stopPropagation(); addToCart(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')">
                Thêm vào giỏ
              </button>
              <button onclick="event.stopPropagation(); buyNow(${p.id}, '${escapeHtml(p.ten_san_pham)}', ${p.gia_ban}, '${p.anh}')" class="btn-buy-now">
                Mua ngay
              </button>
            </div>
          `).join('')}
        </div>
      `;
    }
  } catch (err) {
    console.error('Lỗi tìm kiếm:', err);
    alert('Lỗi khi tìm kiếm');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = $('search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }
  if (token) updateUINav();
});

// ========== ADMIN - QUẢN LÝ ĐƠN HÀNG ==========
async function showAdminOrders() {
  if (!token) { alert('Chưa đăng nhập!'); return; }
  try {
    const payload = token.split('.')[1];
    const decoded = decodeBase64Url(payload);
    if (decoded.la_admin !== 1) { alert('Không có quyền!'); return; }
  } catch (e) {
    alert('Token không hợp lệ!');
    logout();
    return;
  }
  
  try {
    $('content').innerHTML = '<div class="loading">Đang tải đơn hàng...</div>';
    hide($('search-bar'));
    
    const orders = await api('/admin/don-hang', 'GET');
    
    if (!orders || orders.length === 0) {
      $('content').innerHTML = `<h2>Quản lý đơn hàng</h2><p>Chưa có đơn hàng nào.</p>`;
      return;
    }
    
    $('content').innerHTML = `
      <h2>Quản lý đơn hàng (Tổng: ${orders.length} đơn)</h2>
      <div class="orders-list">
        ${orders.map(o => `
          <div class="order-card">
            <div class="order-header">
              <strong>Đơn #${o.id}</strong>
              <span class="status status-${o.trang_thai}">${formatStatus(o.trang_thai)}</span>
            </div>
            <div class="order-info">
              <p><strong>Khách hàng:</strong> ${o.ten_nguoi_nhan} - ${o.dien_thoai_nguoi_nhan}</p>
              <p><strong>Địa chỉ:</strong> ${o.dia_chi_giao}</p>
              <p><strong>Tổng tiền:</strong> ${formatPrice(o.tong_tien)}</p>
              <p><strong>Ngày đặt:</strong> ${formatDate(o.ngay_tao)}</p>
              ${o.ma_cod ? `<p><strong>Mã COD:</strong> ${o.ma_cod}</p>` : ''}
              ${o.ghi_chu ? `<p><strong>Ghi chú:</strong> ${o.ghi_chu}</p>` : ''}
            </div>
            <div class="order-actions">
              <button onclick="callConfirm(${o.id}, '${o.dien_thoai_nguoi_nhan}')" class="btn-call">Gọi xác nhận</button>
              <button onclick="updateStatusQuick(${o.id}, 'da_xac_nhan')" class="btn-status">Xác nhận</button>
              <button onclick="updateStatusQuick(${o.id}, 'dang_dong_goi')" class="btn-status">Chuyển đóng gói</button>
              <button onclick="updateStatusQuick(${o.id}, 'dang_giao')" class="btn-status">Gửi bưu điện</button>
              <button onclick="updateOrderCOD(${o.id})" class="btn-cod">Cập nhật COD</button>
              <button onclick="updateStatusQuick(${o.id}, 'da_giao')" class="btn-status">Hoàn thành giao</button>
              <button onclick="updateStatusQuick(${o.id}, 'da_huy')" class="btn-huy">Hủy hàng</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    console.error('Lỗi load đơn hàng:', err);
    $('content').innerHTML = '<h2>Không thể tải đơn hàng</h2>';
  }
}

async function callConfirm(orderId, phone) {
  if (confirm(`Gọi xác nhận cho ${phone}?`)) {
    const note = prompt('Ghi chú sau gọi:') || `Đã gọi xác nhận lúc ${new Date().toLocaleString('vi-VN')}`;
    try {
      const res = await api(`/admin/don-hang/${orderId}`, 'PUT', { ghi_chu: note });
      if (res.success) {
        alert('Cập nhật thành công!');
        showAdminOrders();
      }
    } catch (err) {
      alert('Lỗi cập nhật!');
    }
  }
}

async function updateStatusQuick(orderId, status) {
  if (confirm(`Cập nhật thành ${formatStatus(status)}?`)) {
    try {
      const res = await api(`/admin/don-hang/${orderId}`, 'PUT', { trang_thai: status });
      if (res.success) {
        alert('Cập nhật thành công!');
        showAdminOrders();
      }
    } catch (err) {
      alert('Lỗi cập nhật!');
    }
  }
}

async function updateOrderCOD(orderId) {
  const maCOD = prompt('Nhập mã COD:');
  if (!maCOD) return;
  
  try {
    const res = await api(`/admin/don-hang/${orderId}`, 'PUT', { ma_cod: maCOD });
    if (res.success) {
      alert('Cập nhật mã COD thành công!');
      showAdminOrders();
    } else {
      alert('Lỗi: ' + (res.error || 'Không thể cập nhật'));
    }
  } catch (err) {
    console.error('Lỗi cập nhật:', err);
    alert('Lỗi kết nối!');
  }
}

// ========== HELPER FUNCTIONS ==========
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('vi-VN');
}

function formatStatus(status) {
  const statuses = {
    'cho_xac_nhan': 'Chờ xác nhận',
    'da_xac_nhan': 'Đã xác nhận',
    'dang_dong_goi': 'Đang đóng gói',
    'dang_giao': 'Đang giao',
    'da_giao': 'Đã giao',
    'da_huy': 'Đã hủy'
  };
  return statuses[status] || status;
}

function escapeHtml(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function toggleUserMenu() {
  const menu = $('user-menu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

async function updateUINav() {
  if (!token) return;
  
  try {
    const payload = token.split('.')[1];
    const decoded = decodeBase64Url(payload);
    
    if (!decoded || !decoded.id) throw new Error("Token không hợp lệ");
    const userId = decoded.id;
    const isAdmin = decoded.la_admin === 1;

    const response = await fetch(`/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(`API /user/ Lỗi: ${response.statusText}`);

    const data = await response.json();
    if (!data || data.length === 0) throw new Error("Không tìm thấy user.");

    const user = data[0];
    const userName = user.ho_ten || user.ten_dang_nhap || 'User';
    
    $('user-display').textContent = userName;
    show($('user-name'));
    show($('orders-btn'));
    
    if (isAdmin) {
      show($('admin-btn'));
      show($('stats-btn'));
    } else {
      hide($('admin-btn'));
      hide($('stats-btn'));
    }
    
    updateCartCount(userId);
    showHome();
    
  } catch (e) {
    console.error('Lỗi updateUINav:', e);
    alert('Lỗi tải thông tin user, đăng xuất!');
    logout();
  }
}