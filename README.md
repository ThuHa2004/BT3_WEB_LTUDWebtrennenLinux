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
- Cấu trúc thư mục:
```
BT3_LTUDWEB_TrenNenLinux/
├── docker-compose.yml
├── nginx/
│   └── default.conf
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── node-red/
│   └── data/       # Node-RED flows, settings.js sẽ tự sinh
├── mariadb/
│   └── data/       # Database volume
├── grafana/
│   └── data/
├── influxdb/
│   └── data/
```

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

### 2. Cài đặt Docker
- Download Docker trên trang `Docker Desktop for Windows`, sau khi download về thì tiến hành cài đặt docker. Sau khi đã cài đặt xong, mở docker vào Setting -> Resource -> WSL INTEGRATION -> Tích chọn enable... và tích hợp ubuntu-22.04

  <img width="1588" height="895" alt="image" src="https://github.com/user-attachments/assets/362a5924-2b9c-40a3-988b-7da89b9e3b00" />

- Kiểm tra docker gõ lệnh `docker version`:
  
  <img width="1016" height="729" alt="image" src="https://github.com/user-attachments/assets/49f72856-35c7-48e4-aec9-27c3d909b77e" />

- Chạy lệnh `docker run --rm hello-world`. Nếu thấy dòng "Hello from Docker!" thì có nghĩa là Docker đã được cài đặt thành công.

  <img width="1000" height="527" alt="image" src="https://github.com/user-attachments/assets/f1bd14ec-43a1-48f4-ac74-7986cc4eddb0" />

- Kiểm tra phiên bản docker bằng lệnh `docker compose version`:

  <img width="836" height="105" alt="image" src="https://github.com/user-attachments/assets/0f24f0b6-a501-4213-8054-76b494612c8f" />

### 3. Cài đặt các Docker container (dùng file docker-compose.yml)
#### Mục tiêu là cài đặt 6 container mariadb (3306), phpmyadmin (8080), nodered/node-red (1880), influxdb (8086), grafana/grafana (3000), nginx (80,443)
- `MariaDB (3306)`: CSDL
- `phpMyAdmin (8080)`: Quản lý DB qua web
- `Node-RED (1880)`: Lập trình luồng IoT
- `InfluxDB (8086): CSDL time-series
- `Grafana (3000)`: Dashboard hiển thị dữ liệu
- `Nginx (80, 443)`: Web server 

#### Tạo file `docker-compose.yml` để cài đặt các docker container trên:
```
version: '3.8'

services:
  mariadb:
    image: mariadb:10.11
    container_name: mariadb
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: ShopQA
      MYSQL_USER: thuha
      MYSQL_PASSWORD: thuha123
    ports:
      - "3306:3306"
    volumes:
      - ./mariadb/data:/var/lib/mysql
    networks:
      - banhang-network

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: phpmyadmin
    restart: always
    environment:
      PMA_HOST: mariadb
      PMA_PORT: 3306
      MYSQL_ROOT_PASSWORD: root123
    ports:
      - "8080:80"
    depends_on:
      - mariadb
    networks:
      - banhang-network

  influxdb:
    image: influxdb:2.7
    container_name: influxdb
    restart: always
    environment:
      - DOCKER_INFLUXDB_INIT_MODE=setup
      - DOCKER_INFLUXDB_INIT_USERNAME=admin
      - DOCKER_INFLUXDB_INIT_PASSWORD=admin123
      - DOCKER_INFLUXDB_INIT_ORG=banhang
      - DOCKER_INFLUXDB_INIT_BUCKET=statistics
      - DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=my-super-secret-auth-token
    ports:
      - "8086:8086"
    volumes:
      - ./influxdb/data:/var/lib/influxdb2
    networks:
      - banhang-network

  nodered:
    image: nodered/node-red:latest
    container_name: nodered
    restart: always
    environment:
      - TZ=Asia/Ho_Chi_Minh
    ports:
      - "1880:1880"
    user: "1000:1000"
    volumes:
      - ./node-red/data:/data
    depends_on:
      - mariadb
      - influxdb
    networks:
      - banhang-network
    command: >
      sh -c "npm install -g node-red-node-mysql &&
      node-red --httpNodeRoot=/api --httpAdminRoot=/nodered
      --functionGlobalContext='{\"mysql\":require(\"mysql\").createPool({host:\"mariadb\",user:\"thuha\",password:\"thuha123\",database:\"ShopQA\",port:3306,charset:\"utf8mb4\",connectionLimit:10}),\"crypto\":require(\"crypto\")}'"

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    environment:
      - GF_SERVER_HTTP_PORT=3000
      - GF_SERVER_ROOT_URL=%(protocol)s://tranthithuha.com/grafana/
      - GF_SERVER_SERVE_FROM_SUB_PATH=true
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    ports:
      - "3000:3000"
    volumes:
      - ./grafana/data:/var/lib/grafana
    depends_on:
      - influxdb
    networks:
      - banhang-network

  nginx:
    image: nginx:latest
    container_name: nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      # File cấu hình nginx reverse proxy cho Node-RED và Grafana
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      # Thư mục chứa chứng chỉ SSL (nếu bạn dùng https)
      - ./nginx/certs:/etc/nginx/certs:ro
      # Thư mục web frontend SPA (index.html, js, css,…)
      - ./frontend:/usr/share/nginx/html:ro
    depends_on:
      - nodered
      - grafana
    networks:
      - banhang-network

networks:
  banhang-network:
    driver: bridge
```
- Sau khi tạo file `docker-compose.yml`, khởi động lại tất cả container bằng cách chạy lệnh `docker compose up -d` trong thư mục chứa file `docker-compose.yml`.

  <img width="1905" height="278" alt="image" src="https://github.com/user-attachments/assets/f052a0d1-3b72-4647-b00f-0d3ef616399a" />

- Kiểm tra container: chạy lệnh `docker ps`.

  <img width="1919" height="383" alt="image" src="https://github.com/user-attachments/assets/f6fc1a14-c628-404b-b7ce-d9d6cc673848" />

### 4. Cấu hình Nginx làm Web-server 
#### Bước 1: Tạo file cấu hình `default.conf` trong thư mục `nginx`
```
server {
    listen 80;
    server_name tranthithuha.com www.tranthithuha.com;

    # === Gốc: SPA Frontend ===
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # === API Backend (Node-RED) ===
    location /api/ {
        proxy_pass http://nodered:1880/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
 
    # === Node-RED UI ===
    location /nodered/ {
        # Loại bỏ prefix /nodered/ khi chuyển tiếp đến Node-RED
        rewrite ^/nodered/(.*)$ /$1 break;
        proxy_pass http://nodered:1880/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # === Grafana ===
    location /grafana/ {
        proxy_pass http://grafana:3000/;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Fix redirect khi dùng subpath /grafana
        proxy_redirect http://grafana:3000/ /grafana/;
        proxy_redirect / /grafana/;
    }

    # === Bảo mật Header ===
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
  #  add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # === 404 Fallback cho SPA ===
    error_page 404 /index.html;
}

```
##### `172.23.98.16:8086` influxDB:

  <img width="1914" height="979" alt="image" src="https://github.com/user-attachments/assets/238b8065-f8b2-4f3c-973f-f1439db64a96" />

##### `172.23.98.16:8080` phpAdmin:

  <img width="1919" height="817" alt="image" src="https://github.com/user-attachments/assets/506ca4e1-5fdc-4e93-b820-698d97892c12" />

  <img width="1906" height="976" alt="image" src="https://github.com/user-attachments/assets/15d0b9e0-d775-494f-a01d-399933f1fe8a" />

- **Website chính:** `http://tranthithuha.com`
- **Granfana:** `http://tranthithuha.com/grafana`
- **Node-red:** `http://tranthithuha.com/nodered`

### 5. Lập trình web frontend+backend (Web thương mại điện tử)
- Cấu trúc thư mục:
```
   frontend/
   ├── index.html
   ├── app.js
   └── style.css
```


