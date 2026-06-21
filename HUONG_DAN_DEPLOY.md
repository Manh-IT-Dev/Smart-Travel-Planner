# HƯỚNG DẪN CẤU HÌNH VÀ DEPLOY DỰ ÁN LÊN GOOGLE CLOUD PLATFORM (GCP) & FIREBASE

Tài liệu này tổng hợp chi tiết toàn bộ cách hoạt động, các dịch vụ Cloud đã sử dụng, phân tích kiến trúc phục vụ cho báo cáo và hướng dẫn từng bước cấu hình, deploy dự án từ máy cá nhân (Local) lên GCP để đạt điểm số tối đa trong bài báo cáo dự án.

---

## 1. CÁC DỊCH VỤ CLOUD ĐÃ SỬ DỤNG TRÊN GCP

Dự án này là một ứng dụng Web Fullstack hiện đại sử dụng kiến trúc kết hợp Server-side API và Client-side UI linh hoạt, tận dụng tối đa các dịch vụ lưu trữ và tính toán đám mây cao cấp của Google:

| Dịch vụ Cloud                 | Vai trò trong dự án                                                                                                                                       | Lý do chọn lựa (Báo cáo Điểm Cao)                                                                                                                                                                                                     |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Google Cloud Run**          | Chạy toàn bộ ứng dụng container hóa (gồm cả Express Server API và Web Client React).                                                                      | - Tự động mở rộng (Autoscaling) từ 0 đến hàng ngàn container tùy lưu lượng tải.<br>- Tránh lãng phí nhờ cơ chế **Scale-to-Zero** (0đ khi không có ai truy cập).<br>- Hỗ trợ HTTPS mặc định, đảm bảo bảo mật và chứng chỉ SSL tự động. |
| **Google Cloud Firestore**    | Cơ sở dữ liệu NoSQL chính lưu trữ thông tin thời gian thực: Cài đặt cá nhân thành viên, danh sách địa chỉ yêu thích, kế hoạch lịch trình.                 | - Đồng bộ dữ liệu đa thiết bị cực nhanh thông qua cơ chế WebSockets/gRPC tích hợp bên dưới.<br>- Quản lý lưu trữ không máy chủ (Serverless DB) tự động tối ưu hóa hiệu suất đọc/ghi dữ liệu.                                          |
| **Firebase Authentication**   | Quản lý đăng nhập, cấp quyền người dùng một cách an toàn thông qua Federated Google Sign-In.                                                              | - Giảm thiểu tối đa việc phải xây dựng hệ thống quản lý mật khẩu từ đầu.<br>- Ngăn ngừa các lỗ hổng bảo mật phổ biến nhờ hệ thống Token JWT tiêu chuẩn từ Google.                                                                     |
| **Google Artifact Registry**  | Kho lưu trữ Docker Images riêng tư an toàn trước khi deploy lên Cloud Run.                                                                                | - Phiên bản nâng cấp bảo mật hơn và có hiệu suất quét lỗ hổng nhanh hơn Container Registry (Deprecated).                                                                                                                              |
| **Google GenAI API (Gemini)** | Trí tuệ nhân tạo tạo sinh của Google thực hiện phân tích chất lượng/độ nguy hiểm của cảnh báo thời tiết và tự động vạch ra lộ trình chuyến đi thông minh. | - Mô hình AI nhanh, tối tân (`gemini-2.5-flash` và các bản dự phòng), xử lý ngữ cảnh đa ngôn ngữ chính xác cao.                                                                                                                       |

---

## 2. PHÂN TÍCH SO SÁNH: TẠI SAO DÙNG FIREBASE FIRESTORE THAY VÌ CLOUD STORAGE?

Một trong những câu hỏi phản biện cực kỳ phổ biến từ Hội đồng khảo thí là sự thấu hiểu về **Storage vs Database**. Dưới đây là bảng so sánh sâu sắc giúp bạn lấy điểm tuyệt đối:

| Tiêu chí so sánh           | Google Cloud Storage (Object Storage)                                                                                              | Google Cloud Firestore (Document Database)                                                                                      |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **Bản chất dữ liệu**       | Phù hợp cho dữ liệu **không có cấu trúc**, kích thước lớn (Hình ảnh chụp, file video lưu trữ, file sao lưu ZIP, file PDF báo cáo). | Phù hợp cho dữ liệu **bán cấu trúc (JSON)**, dung lượng nhỏ, cần cập nhật liên tục hoặc cập nhật từng phần.                     |
| **Khả năng truy vấn**      | Không hỗ trợ tìm kiếm sâu bên trong file. Muốn đọc hoặc thay đổi 1 dòng dữ liệu phải tải xuống và ghi đè lại toàn bộ tệp tin.      | Cho phép truy vấn, lọc dữ liệu sâu (Filter, Sort), lập chỉ mục (Indexes) để tìm kiếm chính xác các thuộc tính của tài liệu.     |
| **Độ trễ và Đồng bộ**      | Độ trễ cao hơn, không hỗ trợ lắng nghe trực tiếp sự thay đổi thời gian thực (Realtime listeners).                                  | Độ trễ cực thấp, cung cấp SDK Real-Time SDK giúp đồng bộ ứng dụng tức thì với máy chủ Firestore khi dữ liệu thay đổi.           |
| **Sự phù hợp trong dự án** | **KHÔNG phù hợp** cho việc lưu Preferences cá nhân, danh sách lịch trình chuyến đi chi tiết.                                       | **RẤT phù hợp** cho việc lưu trữ tùy chỉnh ngôn ngữ, danh sách Itinerary lưu trữ, và cập nhật liên tục các cảnh báo riêng biệt. |

**Kết luận áp dụng**: Dự án này sử dụng dữ liệu là các cài đặt của người dùng, danh sách các lịch trình Itinerary dạng cấu trúc JSON, cần truy vấn nhanh theo ID người dùng và cập nhật tức thì. Vì vậy việc chọn **Cloud Firestore** là hoàn toàn đúng đắn về mặt kiến trúc phần mềm cao cấp, trong khi **Cloud Storage** chỉ nên sử dụng khi ứng dụng có thêm tính năng upload ảnh avatar người dùng (dữ liệu vật lý dạng file).

---

## 3. CÁC ĐỊNH NGHĨA CƠ BẢN VỀ CLOUD TRONG DỰ ÁN (VPC, Zone, Region, Network)

Dự án này đã hiện thực hóa đầy đủ các khái niệm cơ bản về quy hoạch hạ tầng Cloud:

- **Region (Vùng địa lý)**:
  - Ứng dụng Cloud Run, cơ sở dữ liệu Firestore và các endpoints API được triển khai tại các Region gần Việt Nam nhất (như `asia-east1` - Đài Loan, hoặc `asia-southeast1` - Singapore) để tối ưu thời gian phản hồi mạng (RTT - Round Trip Time), giảm độ trễ tối đa cho người dùng Việt Nam.
- **Zone (Phân vùng sẵn sàng)**:
  - Cloud Run và Firestore là các dịch vụ mang tính chất **Multi-Zone (Regional)** hoặc **Cross-Zone High Availability**. Bản thân Google Cloud cam kết phân tán các container và các shard dữ liệu sang nhiều Zone vật lý khác nhau trong cùng một Region để đảm bảo ứng dụng không bao giờ bị gián đoạn hoạt động ngay cả khi một trung tâm dữ liệu gặp sự cố mất điện vật lý.
- **VPC (Virtual Private Cloud - Mạng ảo dùng riêng)**:
  - Khi deploy, dự án của bạn chạy cô lập bên trong hạ tầng mạng riêng tư của GCP (Google-managed VPC). Khách truy cập từ bên ngoài chỉ có thể đi qua một cổng tiếp nhận duy nhất là HTTPS Load Balancer mở bởi Google Cloud Run.
  - Dự án bảo mật an toàn khóa bí mật (`GEMINI_API_KEY`) bằng cách proxy toàn bộ các tác vụ xử lý AI qua server Express (chạy trong VPC) và chỉ truyền các tín hiệu sạch sau xử lý về cho Client UI. Trình duyệt người dùng (Client) không bao giờ chạm tay được vào API keys!

---

## 4. HƯỚNG DẪN CẤU HÌNH CHI TIẾT TỪ MÁY LOCAL

Hãy thực hiện theo các bước chính xác dưới đây để chuẩn bị và deploy mã nguồn từ máy tính của bạn:

### Bước 4.1: Cấu hình Firebase Console

1. Truy cập vào [Firebase Console](https://console.firebase.google.com/).
2. Nhấp vào **Add project** và đặt tên cho dự án của bạn (ví dụ: `ThoiTietAI-Project`). Chọn cấu hình vùng tài nguyên của bạn.
3. Kích hoạt **Firebase Authentication**:
   - Menu trái -> **Build** -> **Authentication** -> Bấm **Get Started**.
   - Chuyển sang tab **Sign-in method** -> Chọn **Google** -> Kích hoạt (Enable) và điền email hỗ trợ. Bấm **Save**.
4. Kích hoạt **Cloud Firestore**:
   - Menu trái -> **Build** -> **Firestore Database** -> Bấm **Create database**.
   - Chọn chế độ **Default database** or ID mong muốn, đặt vị trí vùng dữ liệu gần Việt Nam (ví dụ: `asia-southeast1`).
   - Chọn kiểu bảo mật ở chế độ thử nghiệm (Test mode) trước hoặc Deploy Rules có sẵn bằng file `firestore.rules`.
5. Liên kết Web App và lưu file cấu hình:
   - Tại trang chủ Firebase Project, bấm vào biểu tượng `</>` (Web App) để đăng ký một ứng dụng mới.
   - Firebase sẽ xuất hiện một đoạn mã JavaScript config. Hãy sao chép thông tin đó và ghi đè vào file `/src/firebase-applet-config.json` hoặc lưu chúng vào các biến môi trường của bạn.

---

### Bước 4.2: Cài đặt và chuẩn bị tại Local

Để đóng gói và deploy, máy của bạn cần có các công cụ:

- **Node.js** (Phiên bản v20 trở lên)
- **Docker Desktop** (Để chạy và build thử Image cục bộ)
- **Google Cloud SDK** (gcloud CLI) -> [Tải về và làm theo hướng dẫn cài đặt tại đây](https://cloud.google.com/sdk/docs/install)

Kiểm tra gcloud đã cài đặt thành công bằng cách mở Terminal / CMD và gõ:

```bash
gcloud --version
```

---

### Bước 4.3: Hướng dẫn Deploy từng bước từ máy Local lên GCP

Hãy mở terminal tại thư mục gốc của dự án này và thực hiện các dòng lệnh sau:

#### 1. Đăng nhập vào Google Cloud Account của bạn:

```bash
gcloud auth login
```

_Trình duyệt web sẽ tự động mở ra, hãy chọn tài khoản Gmail của bạn và chấp nhận cấp quyền._

#### 2. Thiết lập ID dự án GCP làm mục tiêu mặc định:

```bash
# Thay thế [YOUR_PROJECT_ID] bằng mã dự án thật của bạn hiển thị trên GCP Console
gcloud config set project [YOUR_PROJECT_ID]
```

#### 3. Bật các API dịch vụ cần thiết trên đám mây của bạn (Chỉ băng qua 1 lần duy nhất):

```bash
gcloud services enable run.googleapis.com \
                       artifactregistry.googleapis.com \
                       containerregistry.googleapis.com
```

#### 4. Khởi tạo một Docker Repository an toàn trên Artifact Registry:

Chúng ta sẽ tạo một kho lưu trữ Docker Image tên là `weather-app-repo` ở cùng một vùng địa lý với máy chủ chạy:

```bash
# Tạo repository lưu trữ Docker
gcloud artifacts repositories create weather-app-repo \
    --repository-format=docker \
    --location=asia-east1 \
    --description="Repository chua code project Thoi Tiet AI"
```

#### 5. Cấp quyền xác thực Docker Client từ máy của bạn sang kho lưu trữ GCP:

```bash
gcloud auth configure-docker asia-east1-docker.pkg.dev
```

#### 6. Build Docker Image cục bộ và Đánh dấu Tag cho kho lưu trữ:

```bash
# Build mã nguồn từ Dockerfile (đã có sẵn cơ chế multi-stage tối ưu dung lượng)
docker build -t asia-east1-docker.pkg.dev/[YOUR_PROJECT_ID]/weather-app-repo/weather-app:v1 .
```

_(Hãy thay thế `[YOUR_PROJECT_ID]` thành ID thật của bạn)._

#### 7. Đẩy Docker Image đã build lên đám mây Google Artifact Registry:

```bash
docker push asia-east1-docker.pkg.dev/[YOUR_PROJECT_ID]/weather-app-repo/weather-app:v1
```

#### 8. Tiến hành Deploy dịch vụ lên Cloud Run:

```bash
# Deploy trực tiếp container Docker với các biến môi trường bảo mật đi kèm
gcloud run deploy weather-ai-service \
    --image=asia-east1-docker.pkg.dev/[YOUR_PROJECT_ID]/weather-app-repo/weather-app:v1 \
    --platform=managed \
    --region=asia-east1 \
    --allow-unauthenticated \
    --port=3000 \
    --set-env-vars=GEMINI_API_KEY="[YOUR_REAL_GEMINI_API_KEY]",APP_URL="[YOUR_FINAL_CLOUDRUN_URL_OR_AUTO]"
```

_Lưu ý_:

- `GEMINI_API_KEY`: Thay bằng API key của bạn để công nghệ AI hoạt động bình thường.
- `--allow-unauthenticated`: Cho phép truy cập công cộng (Bất trị đối với Web Client công cộng).
- Sau khi quá trình tải hoàn tất, Cloud Run sẽ xuất ra một liên kết HTTPS của ứng dụng dưới dạng: `https://weather-ai-service-xxx.run.app`. Đây chính là ứng dụng đã hoàn thiện chạy trên môi trường mượt mà của Google Cloud!

---

## 5. KIỂM TRA & ĐỒNG BỘ NGUỒN TỰ ĐỘNG (CI/CD KHUYẾN NGHỊ ĐỂ ĐẠT ĐIỂM SÁNG TẠO)

Nếu muốn gây ấn tượng mạnh với giảng viên, bạn có thể thiết lập thêm **GitHub Actions** để tự động Deploy mỗi khi push code mới lên GitHub.

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Continuous Deployment to Cloud Run

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Authenticate with Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1

      - name: Configure Docker
        run: gcloud auth configure-docker asia-east1-docker.pkg.dev

      - name: Build and Push Docker Image
        run: |
          docker build -t asia-east1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/weather-app-repo/weather-app:${{ github.sha }} .
          docker push asia-east1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/weather-app-repo/weather-app:${{ github.sha }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy weather-ai-service \
            --image=asia-east1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/weather-app-repo/weather-app:${{ github.sha }} \
            --region=asia-east1 \
            --allow-unauthenticated \
            --set-env-vars=GEMINI_API_KEY="${{ secrets.GEMINI_API_KEY }}"
```

Chúc bạn bảo vệ đồ án thành công rực rỡ với điểm số tuyệt đối!
