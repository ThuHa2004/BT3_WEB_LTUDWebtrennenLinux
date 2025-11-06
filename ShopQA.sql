-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: mariadb:3306
-- Thời gian đã tạo: Th10 06, 2025 lúc 09:43 PM
-- Phiên bản máy phục vụ: 10.11.14-MariaDB-ubu2204
-- Phiên bản PHP: 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `ShopQA`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ChiTietDonHang`
--

CREATE TABLE `ChiTietDonHang` (
  `id` int(11) NOT NULL,
  `don_hang_id` int(11) NOT NULL,
  `san_pham_id` int(11) NOT NULL,
  `so_luong` int(11) NOT NULL,
  `gia_luc_mua` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ChiTietDonHang`
--

INSERT INTO `ChiTietDonHang` (`id`, `don_hang_id`, `san_pham_id`, `so_luong`, `gia_luc_mua`) VALUES
(1, 1, 1, 2, 200000.00),
(2, 1, 2, 1, 500000.00),
(3, 2, 3, 1, 300000.00),
(4, 2, 4, 1, 150000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `DonHang`
--

CREATE TABLE `DonHang` (
  `ID` int(11) NOT NULL,
  `nguoi_dung_id` int(11) NOT NULL,
  `ten_nguoi_nhan` varchar(100) NOT NULL,
  `dia_chi_giao` varchar(255) NOT NULL,
  `dien_thoai_nguoi_nhan` varchar(20) NOT NULL,
  `TongTien` decimal(10,2) NOT NULL,
  `NgayDat` datetime DEFAULT current_timestamp(),
  `TrangThai` enum('pending','confirmed','packaged','shipped','delivered','cancelled') DEFAULT 'pending',
  `MaCOD` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `DonHang`
--

INSERT INTO `DonHang` (`ID`, `nguoi_dung_id`, `ten_nguoi_nhan`, `dia_chi_giao`, `dien_thoai_nguoi_nhan`, `TongTien`, `NgayDat`, `TrangThai`, `MaCOD`) VALUES
(1, 1, 'Nguyễn Văn A', '123 Đường ABC, TP.HCM', '0123456789', 700000.00, '2025-11-05 14:42:22', 'pending', 'COD123'),
(2, 1, 'Trần Thị B', '456 Đường XYZ, Hà Nội', '0987654321', 450000.00, '2025-11-05 14:42:22', 'confirmed', 'COD456');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `GioHang`
--

CREATE TABLE `GioHang` (
  `ID` int(11) NOT NULL,
  `NguoiDungID` int(11) NOT NULL,
  `SanPhamID` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `GioHang`
--

INSERT INTO `GioHang` (`ID`, `NguoiDungID`, `SanPhamID`, `SoLuong`) VALUES
(1, 1, 1, 3),
(2, 1, 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `NguoiDung`
--

CREATE TABLE `NguoiDung` (
  `id` int(11) NOT NULL,
  `ten_dang_nhap` varchar(50) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `la_admin` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=user, 1=admin',
  `NgayTao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `NguoiDung`
--

INSERT INTO `NguoiDung` (`id`, `ten_dang_nhap`, `mat_khau`, `la_admin`, `NgayTao`) VALUES
(1, 'ha', '53fd2fd9545b2c6a3c3525d48e24e01f14f007ce09a0ce8bab476ef33a338cca', 0, '2025-11-05 14:42:22'),
(2, 'admin', '53fd2fd9545b2c6a3c3525d48e24e01f14f007ce09a0ce8bab476ef33a338cca', 1, '2025-11-05 14:42:22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `NhomSanPham`
--

CREATE TABLE `NhomSanPham` (
  `id` int(11) NOT NULL,
  `Ten` varchar(100) NOT NULL,
  `MoTa` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `NhomSanPham`
--

INSERT INTO `NhomSanPham` (`id`, `Ten`, `MoTa`) VALUES
(1, 'Áo thun', 'Áo thun nam nữ các loại'),
(2, 'Quần jeans', 'Quần jeans thời trang'),
(3, 'Váy đầm', 'Váy đầm nữ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `SanPham`
--

CREATE TABLE `SanPham` (
  `id` int(11) NOT NULL,
  `ten_san_pham` varchar(200) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `Gia` decimal(10,2) NOT NULL,
  `nhom_id` int(11) NOT NULL,
  `SoLuongTon` int(11) DEFAULT 0,
  `so_luot_mua` int(11) DEFAULT 0,
  `la_ban_chay` int(10) DEFAULT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL,
  `NgayThem` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `SanPham`
--

INSERT INTO `SanPham` (`id`, `ten_san_pham`, `mo_ta`, `Gia`, `nhom_id`, `SoLuongTon`, `so_luot_mua`, `la_ban_chay`, `HinhAnh`, `NgayThem`) VALUES
(1, 'Áo khoác dạ nam ', 'Áo khoác dạ nam dáng dài', 200000.00, 1, 100, 50, 0, 'assets/images/1Aodanam.jpg', '2025-11-05 14:42:22'),
(2, 'Quần jeans nữ', 'Quần jeans nữ fashion ', 500000.00, 2, 50, 30, 1, 'assets/images/7jeansnu.jpg', '2025-11-05 14:42:22'),
(3, 'Váy đầm ', 'Váy đầm hè màu trắng', 300000.00, 3, 80, 20, 0, 'assets/images/11vaydai.jpg', '2025-11-05 14:42:22'),
(4, 'Áo len cổ lọ ', 'Áo len nữ cổ lọ', 150000.00, 1, 120, 60, 1, 'assets/images/5Aolencolonu.jpg', '2025-11-05 14:42:22');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `ChiTietDonHang`
--
ALTER TABLE `ChiTietDonHang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DonHangID` (`don_hang_id`),
  ADD KEY `SanPhamID` (`san_pham_id`);

--
-- Chỉ mục cho bảng `DonHang`
--
ALTER TABLE `DonHang`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `NguoiDungID` (`nguoi_dung_id`);

--
-- Chỉ mục cho bảng `GioHang`
--
ALTER TABLE `GioHang`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `uniq_giohang` (`NguoiDungID`,`SanPhamID`),
  ADD KEY `SanPhamID` (`SanPhamID`);

--
-- Chỉ mục cho bảng `NguoiDung`
--
ALTER TABLE `NguoiDung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `TenDangNhap` (`ten_dang_nhap`);

--
-- Chỉ mục cho bảng `NhomSanPham`
--
ALTER TABLE `NhomSanPham`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `SanPham`
--
ALTER TABLE `SanPham`
  ADD PRIMARY KEY (`id`),
  ADD KEY `NhomID` (`nhom_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `ChiTietDonHang`
--
ALTER TABLE `ChiTietDonHang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `DonHang`
--
ALTER TABLE `DonHang`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `GioHang`
--
ALTER TABLE `GioHang`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `NguoiDung`
--
ALTER TABLE `NguoiDung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `NhomSanPham`
--
ALTER TABLE `NhomSanPham`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `SanPham`
--
ALTER TABLE `SanPham`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `ChiTietDonHang`
--
ALTER TABLE `ChiTietDonHang`
  ADD CONSTRAINT `chitietdonhang_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `DonHang` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `chitietdonhang_ibfk_2` FOREIGN KEY (`san_pham_id`) REFERENCES `SanPham` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `DonHang`
--
ALTER TABLE `DonHang`
  ADD CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `NguoiDung` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `GioHang`
--
ALTER TABLE `GioHang`
  ADD CONSTRAINT `giohang_ibfk_1` FOREIGN KEY (`NguoiDungID`) REFERENCES `NguoiDung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `giohang_ibfk_2` FOREIGN KEY (`SanPhamID`) REFERENCES `SanPham` (`id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `SanPham`
--
ALTER TABLE `SanPham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`nhom_id`) REFERENCES `NhomSanPham` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
