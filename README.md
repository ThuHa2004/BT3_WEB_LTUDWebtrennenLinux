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
## 1. Cài đặt môi trường Linux
### Enable wsl: Cài đặt docker desktop
#### Bước 1: Bật WSl và Virtual Machine Platform
**Mở PowerShell với quyền Administrator. Chạy lần lượt 2 lệnh sau:**
- `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`
- `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`

  <img width="1360" height="562" alt="image" src="https://github.com/user-attachments/assets/f3744c92-0f51-48be-88f3-fd3ba08a6fb3" />

**Đặt WSL default verersion = 2**
- Chạy lệnh này trong PowerShell Administrator: `wsl --set-default-version 2`

  <img width="870" height="288" alt="image" src="https://github.com/user-attachments/assets/eb8a1568-fa53-42e1-9ed3-370c38c15277" />

#### Bước 2: Cài Ubuntu bằng PowerShell (hoặc tải từ Microsoft Store)
**Truy cập và link sau `Ubuntu 22.04.5 LTS – Microsoft Store` để download ubuntu**
- Sau khi download ubuntu về máy, tiến hành cài đặt ubuntu, sẽ hiển thị ra của sổ yêu cầu người dùng đặt username và password cho ubuntu để cho các lần sau đăng nhập vào. Như vậy là đã cài đặt thành công ubuntu.
  
  <img width="1471" height="753" alt="Screenshot 2025-11-04 001326" src="https://github.com/user-attachments/assets/a8fc76ec-ca7e-4134-9e11-972a6532547b" />

  <img width="947" height="285" alt="image" src="https://github.com/user-attachments/assets/a6e11458-01aa-4fa6-904d-2aa44b0f9291" />

#### Bước 3: Cài đặt Docker

