# Bài tập 3: Môn phát triển ứng dụng trên nền web
### Giảng viên: Đỗ Duy Cốp
### Lớp học phần: 58KTPM
### Ngày giao: 24-10-2025
### Hạn nộp: 05-11-2025
### Sinh viên thực hiện: Trần Thị Thu Hà - K225480106009
-------------------------------------------------------
# Yêu cầu: Lập trình ứng dụng web trên nền Linux
1. Cài đặt môi trường Linux
2. Cài đặt Docker
3. Sử dụng 1 file `docker-compse.yml` để cài đặt các docker container
4. Lập trình Web frontend+backend
5. Nginx làm web-server 
-------------------------------------------------------
# Bài làm: 
## 1. Cài đặt môi trường Linux: Enable wsl: Cài đặt docker desktop
1. Mở PowerShell với quyền Administrator. Chạy lần lượt 2 lệnh sau:
- `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`
- `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`
