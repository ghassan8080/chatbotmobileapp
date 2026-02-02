const rows = $input.all();

// بداية بناء كود HTML
let html = '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0">';
html += '<link rel="preconnect" href="https://fonts.googleapis.com">';
html += '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
html += '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">';
html += '<style>';

// ===== CSS Variables & Root =====
html += ':root {';
html += '  --primary: #6366f1;';
html += '  --primary-hover: #4f46e5;';
html += '  --primary-light: rgba(99, 102, 241, 0.1);';
html += '  --success: #10b981;';
html += '  --success-hover: #059669;';
html += '  --warning: #f59e0b;';
html += '  --warning-hover: #d97706;';
html += '  --danger: #ef4444;';
html += '  --danger-hover: #dc2626;';
html += '  --bg-main: #0f172a;';
html += '  --bg-card: #1e293b;';
html += '  --bg-card-hover: #334155;';
html += '  --border: #334155;';
html += '  --text-primary: #f1f5f9;';
html += '  --text-secondary: #94a3b8;';
html += '  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2);';
html += '  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3);';
html += '  --radius: 12px;';
html += '  --radius-sm: 8px;';
html += '  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);';
html += '}';

// ===== Reset & Base =====
html += '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }';
html += 'body {';
html += '  direction: rtl;';
html += '  font-family: "Tajawal", "Segoe UI", sans-serif;';
html += '  background: linear-gradient(135deg, var(--bg-main) 0%, #1a1a2e 100%);';
html += '  min-height: 100vh;';
html += '  padding: 24px;';
html += '  color: var(--text-primary);';
html += '  line-height: 1.6;';
html += '}';

// ===== Container =====
html += '.container { max-width: 1400px; margin: 0 auto; }';

// ===== Header =====
html += '.header {';
html += '  display: flex;';
html += '  align-items: center;';
html += '  justify-content: space-between;';
html += '  margin-bottom: 32px;';
html += '  flex-wrap: wrap;';
html += '  gap: 16px;';
html += '}';

html += '.header-title {';
html += '  display: flex;';
html += '  align-items: center;';
html += '  gap: 12px;';
html += '}';

html += '.header-title h1 {';
html += '  font-size: 28px;';
html += '  font-weight: 700;';
html += '  background: linear-gradient(135deg, var(--primary) 0%, #a855f7 100%);';
html += '  -webkit-background-clip: text;';
html += '  -webkit-text-fill-color: transparent;';
html += '  background-clip: text;';
html += '}';

html += '.header-icon {';
html += '  font-size: 32px;';
html += '  animation: float 3s ease-in-out infinite;';
html += '}';

html += '@keyframes float {';
html += '  0%, 100% { transform: translateY(0); }';
html += '  50% { transform: translateY(-8px); }';
html += '}';

// ===== Stats Bar =====
html += '.stats-bar {';
html += '  display: flex;';
html += '  gap: 16px;';
html += '  margin-bottom: 24px;';
html += '  flex-wrap: wrap;';
html += '}';

html += '.stat-card {';
html += '  background: var(--bg-card);';
html += '  border: 1px solid var(--border);';
html += '  border-radius: var(--radius);';
html += '  padding: 20px 24px;';
html += '  flex: 1;';
html += '  min-width: 150px;';
html += '  display: flex;';
html += '  align-items: center;';
html += '  gap: 16px;';
html += '  transition: var(--transition);';
html += '}';

html += '.stat-card:hover {';
html += '  transform: translateY(-2px);';
html += '  box-shadow: var(--shadow-lg);';
html += '  border-color: var(--primary);';
html += '}';

html += '.stat-icon {';
html += '  width: 48px;';
html += '  height: 48px;';
html += '  border-radius: var(--radius-sm);';
html += '  display: flex;';
html += '  align-items: center;';
html += '  justify-content: center;';
html += '  font-size: 24px;';
html += '}';

html += '.stat-icon.primary { background: var(--primary-light); }';
html += '.stat-info h3 { font-size: 24px; font-weight: 700; }';
html += '.stat-info p { font-size: 14px; color: var(--text-secondary); }';

// ===== Buttons =====
html += '.btn {';
html += '  display: inline-flex;';
html += '  align-items: center;';
html += '  gap: 8px;';
html += '  padding: 12px 24px;';
html += '  font-size: 15px;';
html += '  font-weight: 600;';
html += '  font-family: inherit;';
html += '  border: none;';
html += '  border-radius: var(--radius-sm);';
html += '  cursor: pointer;';
html += '  transition: var(--transition);';
html += '  text-decoration: none;';
html += '}';

html += '.btn-primary {';
html += '  background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);';
html += '  color: white;';
html += '  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);';
html += '}';

html += '.btn-primary:hover {';
html += '  transform: translateY(-2px);';
html += '  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);';
html += '}';

html += '.btn-warning {';
html += '  background: linear-gradient(135deg, var(--warning) 0%, #fbbf24 100%);';
html += '  color: #1a1a2e;';
html += '}';

html += '.btn-warning:hover { transform: translateY(-1px); filter: brightness(1.1); }';

html += '.btn-danger {';
html += '  background: linear-gradient(135deg, var(--danger) 0%, #f87171 100%);';
html += '  color: white;';
html += '}';

html += '.btn-danger:hover { transform: translateY(-1px); filter: brightness(1.1); }';

html += '.btn-sm { padding: 8px 16px; font-size: 13px; }';

html += '.btn-icon {';
html += '  width: 36px;';
html += '  height: 36px;';
html += '  padding: 0;';
html += '  justify-content: center;';
html += '  border-radius: 50%;';
html += '}';

// ===== Table =====
html += '.table-container {';
html += '  background: var(--bg-card);';
html += '  border: 1px solid var(--border);';
html += '  border-radius: var(--radius);';
html += '  overflow: hidden;';
html += '  box-shadow: var(--shadow);';
html += '}';

html += '.table-header {';
html += '  display: flex;';
html += '  align-items: center;';
html += '  justify-content: space-between;';
html += '  padding: 20px 24px;';
html += '  border-bottom: 1px solid var(--border);';
html += '}';

html += '.table-header h2 {';
html += '  font-size: 18px;';
html += '  font-weight: 600;';
html += '  display: flex;';
html += '  align-items: center;';
html += '  gap: 8px;';
html += '}';

html += 'table { width: 100%; border-collapse: collapse; }';

html += 'thead { background: rgba(99, 102, 241, 0.1); }';

html += 'th {';
html += '  padding: 16px 20px;';
html += '  text-align: right;';
html += '  font-weight: 600;';
html += '  font-size: 13px;';
html += '  text-transform: uppercase;';
html += '  letter-spacing: 0.5px;';
html += '  color: var(--text-secondary);';
html += '  border-bottom: 1px solid var(--border);';
html += '}';

html += 'td {';
html += '  padding: 16px 20px;';
html += '  text-align: right;';
html += '  vertical-align: middle;';
html += '  border-bottom: 1px solid var(--border);';
html += '  transition: var(--transition);';
html += '}';

html += 'tbody tr {';
html += '  transition: var(--transition);';
html += '}';

html += 'tbody tr:hover {';
html += '  background: var(--bg-card-hover);';
html += '}';

html += 'tbody tr:last-child td { border-bottom: none; }';

// ===== Product Images =====
html += '.product-images {';
html += '  display: flex;';
html += '  gap: 8px;';
html += '  flex-wrap: wrap;';
html += '}';

html += '.product-img {';
html += '  width: 56px;';
html += '  height: 56px;';
html += '  border-radius: var(--radius-sm);';
html += '  object-fit: cover;';
html += '  border: 2px solid var(--border);';
html += '  cursor: pointer;';
html += '  transition: var(--transition);';
html += '}';

html += '.product-img:hover {';
html += '  transform: scale(1.15);';
html += '  border-color: var(--primary);';
html += '  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);';
html += '  z-index: 10;';
html += '  position: relative;';
html += '}';

// ===== Product Info =====
html += '.product-name {';
html += '  font-weight: 600;';
html += '  font-size: 15px;';
html += '  color: var(--text-primary);';
html += '}';

html += '.product-desc {';
html += '  font-size: 14px;';
html += '  color: var(--text-secondary);';
html += '  max-width: 300px;';
html += '  line-height: 1.5;';
html += '}';

html += '.product-price {';
html += '  font-weight: 700;';
html += '  font-size: 16px;';
html += '  color: var(--success);';
html += '  display: flex;';
html += '  align-items: center;';
html += '  gap: 4px;';
html += '}';

// ===== Actions =====
html += '.actions {';
html += '  display: flex;';
html += '  gap: 8px;';
html += '  justify-content: center;';
html += '}';

// ===== Modal =====
html += '.modal-overlay {';
html += '  position: fixed;';
html += '  inset: 0;';
html += '  background: rgba(15, 23, 42, 0.85);';
html += '  backdrop-filter: blur(8px);';
html += '  display: none;';
html += '  justify-content: center;';
html += '  align-items: center;';
html += '  z-index: 1000;';
html += '  padding: 24px;';
html += '  animation: fadeIn 0.3s ease;';
html += '}';

html += '.modal-overlay.active { display: flex; }';

html += '@keyframes fadeIn {';
html += '  from { opacity: 0; }';
html += '  to { opacity: 1; }';
html += '}';

html += '@keyframes slideUp {';
html += '  from { opacity: 0; transform: translateY(20px) scale(0.95); }';
html += '  to { opacity: 1; transform: translateY(0) scale(1); }';
html += '}';

html += '.modal-content {';
html += '  background: var(--bg-card);';
html += '  border: 1px solid var(--border);';
html += '  padding: 32px;';
html += '  border-radius: var(--radius);';
html += '  width: 100%;';
html += '  max-width: 520px;';
html += '  max-height: 90vh;';
html += '  overflow-y: auto;';
html += '  box-shadow: var(--shadow-lg);';
html += '  animation: slideUp 0.3s ease;';
html += '}';

html += '.modal-header {';
html += '  display: flex;';
html += '  align-items: center;';
html += '  justify-content: space-between;';
html += '  margin-bottom: 24px;';
html += '  padding-bottom: 16px;';
html += '  border-bottom: 1px solid var(--border);';
html += '}';

html += '.modal-header h3 {';
html += '  font-size: 20px;';
html += '  font-weight: 700;';
html += '  display: flex;';
html += '  align-items: center;';
html += '  gap: 10px;';
html += '}';

html += '.modal-close {';
html += '  width: 32px;';
html += '  height: 32px;';
html += '  border-radius: 50%;';
html += '  border: none;';
html += '  background: var(--bg-card-hover);';
html += '  color: var(--text-secondary);';
html += '  cursor: pointer;';
html += '  display: flex;';
html += '  align-items: center;';
html += '  justify-content: center;';
html += '  font-size: 18px;';
html += '  transition: var(--transition);';
html += '}';

html += '.modal-close:hover {';
html += '  background: var(--danger);';
html += '  color: white;';
html += '}';

// ===== Form =====
html += '.form-group {';
html += '  margin-bottom: 20px;';
html += '}';

html += '.form-group label {';
html += '  display: flex;';
html += '  align-items: center;';
html += '  gap: 8px;';
html += '  margin-bottom: 8px;';
html += '  font-weight: 600;';
html += '  font-size: 14px;';
html += '  color: var(--text-primary);';
html += '}';

html += '.form-group input, .form-group textarea {';
html += '  width: 100%;';
html += '  padding: 14px 16px;';
html += '  border: 1px solid var(--border);';
html += '  border-radius: var(--radius-sm);';
html += '  font-size: 15px;';
html += '  font-family: inherit;';
html += '  background: var(--bg-main);';
html += '  color: var(--text-primary);';
html += '  transition: var(--transition);';
html += '}';

html += '.form-group input:focus, .form-group textarea:focus {';
html += '  outline: none;';
html += '  border-color: var(--primary);';
html += '  box-shadow: 0 0 0 3px var(--primary-light);';
html += '}';

html += '.form-group input::placeholder, .form-group textarea::placeholder {';
html += '  color: var(--text-secondary);';
html += '}';

html += '.form-group textarea {';
html += '  resize: vertical;';
html += '  min-height: 100px;';
html += '}';

// ===== Image Upload =====
html += '.image-upload-grid {';
html += '  display: grid;';
html += '  grid-template-columns: repeat(2, 1fr);';
html += '  gap: 12px;';
html += '}';

html += '.image-upload-item {';
html += '  position: relative;';
html += '}';

html += '.image-input {';
html += '  width: 100%;';
html += '  padding: 12px;';
html += '  border: 2px dashed var(--border);';
html += '  border-radius: var(--radius-sm);';
html += '  background: var(--bg-main);';
html += '  color: var(--text-secondary);';
html += '  cursor: pointer;';
html += '  transition: var(--transition);';
html += '}';

html += '.image-input:hover {';
html += '  border-color: var(--primary);';
html += '  background: var(--primary-light);';
html += '}';

html += '.image-preview-container {';
html += '  margin-top: 8px;';
html += '  border-radius: var(--radius-sm);';
html += '  overflow: hidden;';
html += '  border: 1px solid var(--border);';
html += '}';

html += '.image-preview-container img {';
html += '  width: 100%;';
html += '  height: 80px;';
html += '  object-fit: cover;';
html += '}';

// ===== Modal Buttons =====
html += '.modal-buttons {';
html += '  display: flex;';
html += '  gap: 12px;';
html += '  justify-content: flex-end;';
html += '  margin-top: 28px;';
html += '  padding-top: 20px;';
html += '  border-top: 1px solid var(--border);';
html += '}';

// ===== Mobile Responsive =====
html += '@media (max-width: 768px) {';
html += '  body { padding: 16px; }';
html += '  .header { flex-direction: column; align-items: stretch; }';
html += '  .header-title { justify-content: center; }';
html += '  .table-container { overflow-x: auto; }';
html += '  table { min-width: 700px; }';
html += '  .stat-card { min-width: 100%; }';
html += '  .modal-content { padding: 24px; }';
html += '  .image-upload-grid { grid-template-columns: 1fr; }';
html += '}';

// ===== Scrollbar =====
html += '::-webkit-scrollbar { width: 8px; height: 8px; }';
html += '::-webkit-scrollbar-track { background: var(--bg-main); }';
html += '::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }';
html += '::-webkit-scrollbar-thumb:hover { background: var(--primary); }';

// ===== Empty State =====
html += '.empty-state {';
html += '  text-align: center;';
html += '  padding: 60px 20px;';
html += '  color: var(--text-secondary);';
html += '}';

html += '.empty-state-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.5; }';
html += '.empty-state h3 { font-size: 18px; margin-bottom: 8px; color: var(--text-primary); }';
html += '.empty-state p { font-size: 14px; }';

html += '</style></head><body>';

// ===== Page Content =====
html += '<div class="container">';

// Header
html += '<div class="header">';
html += '<div class="header-title">';
html += '<span class="header-icon">📦</span>';
html += '<h1>إدارة المنتجات</h1>';
html += '</div>';
html += '<button class="btn btn-primary" onclick="openAddProductModal()">➕ إضافة منتج جديد</button>';
html += '</div>';

// Stats Bar
html += '<div class="stats-bar">';
html += '<div class="stat-card">';
html += '<div class="stat-icon primary">📊</div>';
html += '<div class="stat-info"><h3>' + rows.length + '</h3><p>إجمالي المنتجات</p></div>';
html += '</div>';
html += '</div>';

// Table
html += '<div class="table-container">';
html += '<div class="table-header">';
html += '<h2>🗂️ قائمة المنتجات</h2>';
html += '</div>';

if (rows.length === 0) {
    html += '<div class="empty-state">';
    html += '<div class="empty-state-icon">📭</div>';
    html += '<h3>لا توجد منتجات</h3>';
    html += '<p>ابدأ بإضافة منتج جديد</p>';
    html += '</div>';
} else {
    html += '<table><thead><tr>';
    html += '<th>الصور</th>';
    html += '<th>اسم المنتج</th>';
    html += '<th>الوصف</th>';
    html += '<th>السعر</th>';
    html += '<th>الإجراءات</th>';
    html += '</tr></thead><tbody>';

    for (const product of rows) {
        const data = product.json;
        const id = data.id;
        const safeName = (data.name || '').replace(/"/g, '&quot;').replace(/'/g, "&#39;");
        const safeDescription = (data.description || '').replace(/"/g, '&quot;').replace(/'/g, "&#39;");
        const price = data.price;

        const imageFields = ["image_url_1", "image_url_2", "image_url_3", "image_url_4"];
        const images = [];
        let imagesHtml = '<div class="product-images">';

        for (const field of imageFields) {
            if (data[field]) {
                const imgUrl = data[field];
                images.push(imgUrl);
                imagesHtml += '<img src="' + imgUrl + '" alt="صورة المنتج" class="product-img" onclick="window.open(this.src, \'_blank\')" />';
            }
        }
        imagesHtml += '</div>';

        html += '<tr>';
        html += '<td>' + imagesHtml + '</td>';
        html += '<td><span class="product-name">' + safeName + '</span></td>';
        html += '<td><span class="product-desc">' + safeDescription + '</span></td>';
        html += '<td><span class="product-price">' + (price || 0) + ' <small>دينار</small></span></td>';

        const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');

        html += '<td><div class="actions">';
        html += '<button class="btn btn-warning btn-sm" onclick="editProduct(' + id + ', \'' + safeName + '\', \'' + safeDescription + '\', ' + (price || 0) + ', ' + imagesJson + ')">✏️ تعديل</button>';
        html += '<button class="btn btn-danger btn-sm" onclick="deleteProduct(' + id + ')">🗑️ حذف</button>';
        html += '</div></td>';
        html += '</tr>';
    }

    html += '</tbody></table>';
}

html += '</div>'; // table-container
html += '</div>'; // container

// ===== Modal =====
html += '<div id="productModal" class="modal-overlay">';
html += '<div class="modal-content">';
html += '<div class="modal-header">';
html += '<h3 id="modalTitle">➕ إضافة منتج جديد</h3>';
html += '<button class="modal-close" onclick="closeModal()">✕</button>';
html += '</div>';
html += '<input type="hidden" id="editProductId" />';

html += '<div class="form-group">';
html += '<label>📝 اسم المنتج</label>';
html += '<input type="text" id="productName" placeholder="أدخل اسم المنتج..." />';
html += '</div>';

html += '<div class="form-group">';
html += '<label>📄 وصف المنتج</label>';
html += '<textarea id="productDesc" placeholder="أدخل وصف المنتج..."></textarea>';
html += '</div>';

html += '<div class="form-group">';
html += '<label>💰 السعر (دينار)</label>';
html += '<input type="number" id="productPrice" placeholder="0.00" />';
html += '</div>';

html += '<div class="form-group">';
html += '<label>🖼️ صور المنتج (حتى 4 صور)</label>';
html += '<div class="image-upload-grid">';
for (let i = 1; i <= 4; i++) {
    html += '<div class="image-upload-item">';
    html += '<input type="file" id="productImage' + i + '" accept="image/*" class="image-input" />';
    html += '<div id="imagePreviewContainer' + i + '" class="image-preview-container" style="display:none;">';
    html += '<img id="previewImg' + i + '" />';
    html += '</div>';
    html += '</div>';
}
html += '</div>';
html += '</div>';

html += '<div class="modal-buttons">';
html += '<button class="btn btn-danger" onclick="closeModal()">❌ إلغاء</button>';
html += '<button id="submitBtn" class="btn btn-primary" onclick="handleFormSubmit()">✅ إضافة</button>';
html += '</div>';
html += '</div></div>';

// ===== JavaScript (UNCHANGED LOGIC) =====
html += '<script>';

html += 'function openAddProductModal() {';
html += '  document.getElementById("productModal").classList.add("active");';
html += '  resetForm();';
html += '}';

html += 'function closeModal() {';
html += '  document.getElementById("productModal").classList.remove("active");';
html += '}';

html += 'function resetForm() {';
html += '  document.getElementById("modalTitle").innerText = "➕ إضافة منتج جديد";';
html += '  document.getElementById("editProductId").value = "";';
html += '  document.getElementById("productName").value = "";';
html += '  document.getElementById("productDesc").value = "";';
html += '  document.getElementById("productPrice").value = "";';
html += '  document.getElementById("submitBtn").innerText = "✅ إضافة";';
html += '  for (let i = 1; i <= 4; i++) {';
html += '    document.getElementById("productImage" + i).value = "";';
html += '    document.getElementById("imagePreviewContainer" + i).style.display = "none";';
html += '    document.getElementById("previewImg" + i).src = "";';
html += '  }';
html += '}';

html += 'async function handleFormSubmit() {';
html += '  const id = document.getElementById("editProductId").value;';
html += '  const name = document.getElementById("productName").value.trim();';
html += '  const description = document.getElementById("productDesc").value.trim();';
html += '  const price = document.getElementById("productPrice").value;';
html += '  if (!name || !description || !price) { alert("يرجى تعبئة جميع الحقول"); return; }';

html += '  const imageData = {};';
html += '  for (let i = 1; i <= 4; i++) {';
html += '    const fileInput = document.getElementById("productImage" + i);';
html += '    if (fileInput.files[0]) {';
html += '      const file = fileInput.files[0];';
html += '      const base64 = await toBase64(file);';
html += '      imageData["image_base64_" + i] = base64;';
html += '      imageData["image_name_" + i] = file.name;';
html += '    }';
html += '  }';

html += '  const url = id ? "https://n8n-n8n.17m6co.easypanel.host/webhook/update-product" : "https://n8n-n8n.17m6co.easypanel.host/webhook/add-product";';
html += '  const payload = { name, description, price: parseFloat(price), seller_id: 1, ...imageData };';
html += '  if (id) payload.product_id = id;';

html += '  try {';
html += '    const btn = document.getElementById("submitBtn");';
html += '    const originalText = btn.innerText;';
html += '    btn.innerText = "⏳ جاري المعالجة..."; btn.disabled = true;';
html += '    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });';
html += '    const result = await res.json();';
html += '    alert(result.message || "تمت العملية بنجاح");';
html += '    closeModal(); location.reload();';
html += '  } catch (err) { alert("حدث خطأ: " + err.message); }';
html += '  finally { document.getElementById("submitBtn").disabled = false; }';
html += '}';

html += 'function toBase64(file) {';
html += '  return new Promise((resolve, reject) => {';
html += '    const reader = new FileReader();';
html += '    reader.readAsDataURL(file);';
html += '    reader.onload = () => resolve(reader.result);';
html += '    reader.onerror = error => reject(error);';
html += '  });';
html += '}';

html += 'function editProduct(id, name, description, price, images) {';
html += '  openAddProductModal();';
html += '  document.getElementById("modalTitle").innerText = "✏️ تعديل المنتج";';
html += '  document.getElementById("submitBtn").innerText = "✅ حفظ التعديلات";';
html += '  document.getElementById("editProductId").value = id;';
html += '  document.getElementById("productName").value = name;';
html += '  document.getElementById("productDesc").value = description;';
html += '  document.getElementById("productPrice").value = price;';
html += '}';

html += 'async function deleteProduct(id) {';
html += '  if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;';
html += '  try {';
html += '    await fetch("https://n8n-n8n.17m6co.easypanel.host/webhook/delete-product", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: id }) });';
html += '    location.reload();';
html += '  } catch (err) { alert("خطأ في الحذف"); }';
html += '}';

html += 'document.addEventListener("DOMContentLoaded", function() {';
html += '  for (let i = 1; i <= 4; i++) {';
html += '    const input = document.getElementById("productImage" + i);';
html += '    if(input) {';
html += '      input.addEventListener("change", function(e) {';
html += '        const file = e.target.files[0];';
html += '        if (file) {';
html += '          const reader = new FileReader();';
html += '          reader.onload = function(event) {';
html += '             document.getElementById("previewImg" + i).src = event.target.result;';
html += '             document.getElementById("imagePreviewContainer" + i).style.display = "block";';
html += '          };';
html += '          reader.readAsDataURL(file);';
html += '        }';
html += '      });';
html += '    }';
html += '  }';
html += '});';

html += '</script></body></html>';

return [{ json: { html } }];
