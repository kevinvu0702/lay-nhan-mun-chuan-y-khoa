MÂY SPA LANDING PAGE V2.1
=========================

Mở website:
1. Giải nén thư mục.
2. Double click index.html để mở bằng Chrome/Edge.

Các phần đã cập nhật trong V2.1:
- Hero: “Lấy Nhân Mụn Chuyên Sâu Chuẩn Y Khoa”.
- Font sans-serif hỗ trợ tiếng Việt, hệ màu xanh Mây + cam CTA.
- Desktop floating CTA: Zalo xanh dương / Gọi Mây cam / Chỉ đường xanh lá.
- Mobile sticky CTA: Zalo xanh dương / Gọi ngay cam / Chỉ đường xanh lá.
- 4 dịch vụ: 289k / Deep Clean 389k / Combo Nặn mụn + Peel vi điểm 500k / Peel trị mụn trải nghiệm 750k.
- Badge màu riêng: Lựa chọn cơ bản / Được chọn nhiều / Không cần liệu trình / Hiệu quả nhất.
- “Không giới hạn thời gian lấy mụn”.
- CTA chính có pulse/glow nhẹ.
- FAQ bổ sung câu không bắt buộc mua liệu trình.
- Feedback thật: component đã sẵn sàng nhưng TỰ ĐỘNG ẨN cho tới khi có ảnh feedback thật.

Cấu hình trong assets/js/main.js:
FORM_ENDPOINT=""        Điểm nhận form thật.
MAPS_URL=""             Link Google Maps thật.
MAPS_EMBED_URL=""       URL iframe Google Maps Embed.
ZALO_URL=""             Link Zalo thật.
GTM_ID / GA4_ID / GOOGLE_ADS_ID / GOOGLE_ADS_LABEL: tracking.

Thêm feedback thật:
1. Copy ảnh feedback dọc/vuông vào assets/images/feedback/.
2. Nên đặt tên đơn giản: feedback-01.webp, feedback-02.webp...
3. Mở assets/js/main.js.
4. Điền FEEDBACK_IMAGES, ví dụ:
   FEEDBACK_IMAGES:["feedback-01.webp","feedback-02.webp","feedback-03.webp"]
5. Section feedback sẽ tự hiện. Desktop hiển thị grid, mobile vuốt ngang.

Lưu ý:
- Form hiện là DEMO MODE khi FORM_ENDPOINT còn trống và không giả báo nhận lead.
- Maps/Zalo chưa tự đoán URL. Điền URL thật trước khi chạy quảng cáo.
- robots hiện noindex,follow theo PPC mode.


FORM NHẬN LEAD (ĐÃ KÍCH HOẠT)
- Form trên landing page gửi trực tiếp vào Google Form bằng hidden iframe.
- Google Form ID: 1FAIpQLSem7tj8DkTekAro0lF32Ox_J736XA52ODlGBd_T0ShpdCDDew
- Họ và tên: entry.663604019
- Số điện thoại: entry.624637788
- Tình trạng: entry.1920438506
- Google Form phải tiếp tục liên kết với Google Sheets để lưu lead.
