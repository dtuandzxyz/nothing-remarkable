# 🎨 Hướng Dẫn Đưa Website HaKai Art Agency Lên GitHub Pages & Tên Miền Riêng

Xin chào **Trần Đình Tuấn**! Đây là bộ mã nguồn hoàn chỉnh của website **HaKai Art Agency**. Dưới đây là hướng dẫn chi tiết từng bước dễ hiểu nhất giúp bạn đăng tải website lên internet miễn phí bằng **GitHub Pages** và kết nối với **Tên miền cá nhân** mà bạn đã mua.

---

## 📁 1. Cấu Trúc Thư Mục Dự Án

Toàn bộ các file nằm tại thư mục `hakai-art-agency/`:

```
hakai-art-agency/
├── index.html              # Trang chính của website
├── CNAME                   # File cấu hình Tên Miền Riêng cho GitHub
├── README.md               # File hướng dẫn này
├── css/
│   ├── style.css           # Giao diện chính, màu sắc & hiệu ứng
│   └── components.css      # Giao diện Gallery, Upload & Xem chi tiết
├── js/
│   ├── app.js              # Xử lý logic tải trang, tìm kiếm, lọc tác phẩm
│   ├── storage.js          # Lưu trữ ảnh/video upload bằng IndexedDB
│   └── data.js             # Danh sách tác phẩm mặc định của bạn
└── assets/
    └── images/             # Nơi lưu trữ ảnh tác phẩm mẫu (artwork_1.jpg, ...)
```

---

## 🚀 2. Các Bước Đưa Website Lên GitHub (Cho Người Mới - Non IT)

### **Cách 1: Upload trực tiếp trên giao diện Web của GitHub (Đơn giản nhất)**

1. **Tạo Kho Lưu Trữ (Repository)**:
   - Đăng nhập vào [GitHub.com](https://github.com).
   - Bấm vào dấu **`+`** ở góc trên bên phải -> Chọn **New repository**.
   - **Repository name**: Nhập tên bất kỳ (ví dụ: `hakai-art-agency` hoặc `hakai-portfolio`).
   - Chọn chế độ **Public** (Công khai).
   - Bấm **Create repository**.

2. **Upload toàn bộ các File lên GitHub**:
   - Ở trang mới hiện ra, bấm vào dòng chữ **"uploading an existing file"**.
   - Kéo và thả toàn bộ các file và thư mục trong thư mục `hakai-art-agency` trên máy tính của bạn vào trang web GitHub.
   - Chờ GitHub tải hết các file lên, sau đó kéo xuống dưới bấm nút **Commit changes** (màu xanh).

---

## ⚙️ 3. Kích Hoạt GitHub Pages (Đăng Website Lên Internet)

1. Vào Repository bạn vừa tạo trên GitHub -> Bấm vào tab **Settings** (ở phía trên cùng).
2. Kéo xuống menu bên trái -> Chọn mục **Pages**.
3. Tại phần **Build and deployment** -> **Branch**:
   - Chọn nhánh **`main`** (hoặc `master`).
   - Thư mục giữ nguyên là **`/ (root)`**.
   - Bấm **Save**.
4. Chờ khoảng 1 - 2 phút, reload lại trang. Bạn sẽ thấy một đường link dạng `https://ten-user-github.github.io/hakai-art-agency/`. Khi bấm vào link này, website của bạn đã chính thức chạy trên internet!

---

## 🌐 4. Gắn Tên Miền Riêng Của Bạn Vào Website

Vì bạn đã có sẵn Tên miền riêng, hãy làm 2 bước sau:

### Bước 4.1: Điền tên miền vào file `CNAME`
1. Mở file `CNAME` trong thư mục code của bạn.
2. Sửa nội dung file `CNAME` thành tên miền của bạn (Xóa các dòng ghi chú `#`, chỉ để duy nhất tên miền của bạn).
   *Ví dụ*: `hakaiart.com` (hoặc `www.hakaiart.com`).
3. Lưu lại và upload file `CNAME` này lên GitHub Repository.

### Bước 4.2: Trỏ DNS tại nhà cung cấp tên miền của bạn
Đăng nhập vào trang quản lý tên miền bạn đã mua (Ví dụ: Mắt Bão, PA Việt Nam, Cloudflare, Namecheap, GoDaddy...) và thêm các bản ghi (DNS Records) sau:

**1. Thêm bản ghi A (Dành cho domain chính dạng `domain.com`):**
- **Type**: `A` | **Name**: `@` | **Value**: `185.199.108.153`
- **Type**: `A` | **Name**: `@` | **Value**: `185.199.109.153`
- **Type**: `A` | **Name**: `@` | **Value**: `185.199.110.153`
- **Type**: `A` | **Name**: `@` | **Value**: `185.199.111.153`

**2. Thêm bản ghi CNAME (Dành cho sub-domain dạng `www`):**
- **Type**: `CNAME` | **Name**: `www` | **Value**: `ten-user-github.github.io`

*Sau khi cấu hình DNS xong, chờ từ 5-15 phút để nhà mạng cập nhật. Khi bạn gõ tên miền của bạn trên trình duyệt, nó sẽ tự động truy cập vào website **HaKai Art Agency**!*

---

## 🌟 5. Các Tính Năng Đã Được Tích Hợp Trên Website

- 🎨 **Giao diện cực đẹp & hiện đại**: Tone màu Dark Cyberpunk, viền mờ Neon Gold, chuyển động siêu mượt.
- 📤 **Upload Tác Phẩm**: Bạn có thể upload trực tiếp ảnh hoặc video từ máy tính của bạn thông qua nút **"✦ Tải Lên Tác Phẩm"**.
- 💾 **Tự động lưu giữ tác phẩm**: Các tác phẩm bạn upload sẽ được lưu vào bộ nhớ trình duyệt (**IndexedDB**), không bị mất khi F5 hoặc tắt trình duyệt.
- 🔍 **Bộ lọc & Tìm kiếm**: Mọi người dễ dàng tìm kiếm theo thể loại (Visual Art, Digital Art, 3D Art, Video) hoặc thẻ tag.
- 🔍 **Xem Chi Tiết & Tải Về**: Click vào từng tác phẩm để mở giao diện toàn màn hình, xem chi tiết mô tả, trình phát video HD, tải file về máy hoặc chia sẻ liên kết.

---
*Chúc **Trần Đình Tuấn** và **HaKai Art Agency** gặt hái được nhiều thành công với những tác phẩm nghệ thuật đỉnh cao!*
