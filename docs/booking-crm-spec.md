# Mây Spa — Booking & lead attribution (draft)

## Appointment request workflow
- `cho_xac_nhan` — Chờ xác nhận: website request received; not a reserved slot.
- `da_xac_nhan` — Đã xác nhận: staff has verified and confirmed appointment.
- `can_doi_gio` — Cần đổi giờ: requested slot unavailable or customer reschedules.
- `khach_huy` — Khách hủy: customer canceled.
- `spa_huy` — Spa hủy: spa canceled.
- `khong_lien_lac_duoc` — Không liên lạc được: confirmation attempts unsuccessful.
- `da_den` — Đã tới: customer arrived.
- `dang_phuc_vu` — Đang thực hiện dịch vụ.
- `hoan_tat` — Hoàn tất: service completed.
- `khong_den` — Không đến: confirmed appointment no-show.

## Suggested Google Sheets columns
created_at,booking_id,name,phone,condition,booking_date,booking_time,booking_status,lead_source,utm_source,utm_medium,utm_campaign,utm_content,utm_term,gclid,gbraid,wbraid,landing_page,booking_cta_source,assigned_staff,confirmed_at,arrived_at,service,amount,notes

Use data validation/dropdown on booking_status with the exact codes above. Keep customer PII in access-controlled Sheets. 

## Tracking and conversion policy
- Primary: verified phone calls; verified successful booking form submissions (not an iframe load).
- Secondary: map directions, form_start, booking_request_submit (attempt), CTA click.
- Do not mark `booking_request_submit` as a successful lead until Apps Script confirms receipt.
- Campaign UTM example: `?utm_source=google&utm_medium=cpc&utm_campaign=search_nanmun_tanphu&utm_content=ag01&utm_term={keyword}`. Google Ads ValueTrack templates may supply `{campaignid}`, `{adgroupid}`, `{creative}`; do not assume these expand outside Google Ads.

## Required backend work BEFORE production
The deployed Apps Script endpoint currently receives a native HTML POST in a hidden iframe. The new booking fields are posted by the form but **may be discarded by the existing Apps Script / Google Form mapping**. Update backend field mapping and the Google Sheet schema, then test with a real submission and verify all columns. Implement a trustworthy server-side success acknowledgment, a unique booking ID, and availability/overlap handling if confirmed reservation slots are desired. Client-side date/time selection alone is not availability management. Preserve the existing main branch until tests pass.
