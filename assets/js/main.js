const CONFIG={
  FORM_ENDPOINT:"",
  MAPS_URL:"https://maps.app.goo.gl/wmgvvp46ANbGNgso7",
  MAPS_EMBED_URL:"",
  GTM_ID:"",
  // GA4 is initialized in index.html; avoid a conflicting unused ID.
  GOOGLE_ADS_ID:"",
  GOOGLE_ADS_LABEL:"",
  // Add real feedback image filenames after placing them in assets/images/feedback/.
  // Example: ["feedback-01.webp","feedback-02.webp","feedback-03.webp"]
  FEEDBACK_IMAGES:[]
};
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const menuBtn=$('.menu-toggle'), nav=$('#nav-menu');
menuBtn?.addEventListener('click',()=>{const open=menuBtn.getAttribute('aria-expanded')==='true';menuBtn.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});
$$('#nav-menu a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));
function track(name,params={}){
  // gtag already writes to dataLayer; pushing again duplicates GTM events.
  if(typeof window.gtag==='function')window.gtag('event',name,params);
  else {window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:name,...params});}
}
function normalizePhone(v=''){return String(v).replace(/\\D/g,'').replace(/^84(?=\\d{9,10}$)/,'0')}
// Record genuine contact clicks without browser-local daily suppression.
function trackOncePerDay(name,params={}){track(name,params);return true}
$$('[data-track]').forEach(el=>el.addEventListener('click',()=>{
 const name=el.dataset.track;
 const params={label:el.textContent.trim(),source:el.dataset.bookingSource||el.id||''};
 if(name==='phone_click'||name==='zalo_click')trackOncePerDay(name,params);
 else track(name,params);
}));
$('#year').textContent=new Date().getFullYear();

function configureExternalLinks(){
 const mapsEls=[$('#maps-direction'),$('#maps-review'),$('#maps-float'),$('#maps-mobile')].filter(Boolean);
 if(CONFIG.MAPS_URL){mapsEls.forEach(el=>{el.href=CONFIG.MAPS_URL;el.target='_blank';el.rel='noopener'})}
 else {mapsEls.forEach(el=>el.addEventListener('click',e=>{if(el.getAttribute('href')==='#')e.preventDefault()}))}
 if(CONFIG.MAPS_EMBED_URL){const slot=$('#map-slot');slot.hidden=false;slot.innerHTML=`<iframe title="Bản đồ Mây Spa Tân Phú" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${CONFIG.MAPS_EMBED_URL}"></iframe>`}
}
configureExternalLinks();

function setupFeedback(){
 const section=$('#feedback'), carousel=$('#feedback-carousel'), more=$('#feedback-more');
 if(!section||!carousel||!Array.isArray(CONFIG.FEEDBACK_IMAGES)||CONFIG.FEEDBACK_IMAGES.length===0)return;
 section.hidden=false;
 CONFIG.FEEDBACK_IMAGES.forEach((name,i)=>{const card=document.createElement('figure');card.className='feedback-card'+(i>3?' is-extra':'');const img=document.createElement('img');img.src=`assets/images/feedback/${name}`;img.alt=`Feedback thực tế từ khách hàng Mây Spa ${i+1}`;img.loading='lazy';card.appendChild(img);carousel.appendChild(card)});
 if(CONFIG.FEEDBACK_IMAGES.length>4){more.hidden=false;more.addEventListener('click',()=>{const open=carousel.classList.toggle('show-all');more.textContent=open?'Thu gọn feedback ↑':'Xem thêm feedback ↓'})}
}
setupFeedback();

const form=$('#lead-form'), status=$('#form-status'), phone=$('#phone'), phoneErr=$('#phone-error'), nameInput=$('#name'), nameErr=$('#name-error'), leadTarget=$('#lead-submit-target');
let submitting=false, awaitingLeadResponse=false, activeRequestId='';
// Each submission carries an unpredictable ID echoed by Apps Script after the Sheet write.
const requestField=document.createElement('input');
requestField.type='hidden';requestField.name='request_id';
form?.appendChild(requestField);
function validPhone(v){return /^0[0-9]{9}$/.test(normalizePhone(v))}
// Persist acquisition attribution in the current browser for direct return visits.
const attributionKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid'];
const query=new URLSearchParams(location.search);
for(const key of attributionKeys){
 const value=(query.get(key)||'').slice(0,250);
 if(value){try{sessionStorage.setItem('may_'+key,value)}catch(_){}}
 const field=form?.elements.namedItem(key);
 if(field){let saved='';try{saved=sessionStorage.getItem('may_'+key)||''}catch(_){}field.value=value||saved}
}
const landingField=form?.elements.namedItem('landing_page');if(landingField)landingField.value=location.origin+location.pathname;
$$('[data-booking-source]').forEach(a=>a.addEventListener('click',()=>{const field=form?.elements.namedItem('booking_cta_source');if(field)field.value=a.dataset.bookingSource||''}));
const bookingDate=$('#booking-date'),bookingTime=$('#booking-time');
function localDateString(d){const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())}
function spaNow(){return new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Ho_Chi_Minh'}))}
function setupBookingSlots(){
 if(!bookingDate||!bookingTime)return;
 const today=spaNow();bookingDate.min=localDateString(today);
 const max=new Date(today);max.setDate(max.getDate()+30);bookingDate.max=localDateString(max);
 const selected=bookingTime.value;bookingTime.innerHTML='<option value="">Chọn thời gian</option>';
 const isToday=bookingDate.value===localDateString(today);
 for(let minute=9*60;minute<=19*60+30;minute+=15){
   if(isToday&&minute<=today.getHours()*60+today.getMinutes())continue;
   const hh=String(Math.floor(minute/60)).padStart(2,'0'),mm=String(minute%60).padStart(2,'0');
   const opt=document.createElement('option');opt.value=hh+':'+mm;opt.textContent=opt.value;bookingTime.appendChild(opt);
 }
 if([...bookingTime.options].some(o=>o.value===selected))bookingTime.value=selected;
}
bookingDate?.addEventListener('change',()=>{bookingTime.value='';setupBookingSlots();$('#booking-date-error').textContent=''});
bookingTime?.addEventListener('change',()=>{$('#booking-time-error').textContent=''});
setupBookingSlots();
nameInput?.addEventListener('input',()=>{if(nameErr)nameErr.textContent=''});
phone?.addEventListener('input',()=>{phoneErr.textContent='';if(!phone.dataset.started){phone.dataset.started='1';track('form_start')}});

const bookingModal=$('#booking-success-modal'),bookingModalDetail=$('#booking-success-detail'),bookingModalClose=$('#booking-success-close');
function closeBookingModal(){if(bookingModal)bookingModal.hidden=true;document.body.style.overflow=''}
bookingModalClose?.addEventListener('click',closeBookingModal);
bookingModal?.addEventListener('click',e=>{if(e.target===bookingModal)closeBookingModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&bookingModal&&!bookingModal.hidden)closeBookingModal()});
let bookingTimer=null, bookingDone=false, bookingDateSent='', bookingTimeSent='';
function showBookingNotice(verified){
 if(bookingDone)return;
 bookingDone=true;awaitingLeadResponse=false;submitting=false;activeRequestId='';
 if(bookingTimer){clearTimeout(bookingTimer);bookingTimer=null}
 if(bookingModalDetail)bookingModalDetail.textContent='Ngày đặt lịch: '+bookingDateSent.split('-').reverse().join('/')+' • Thời gian: '+bookingTimeSent;
 const heading=$('#booking-success-title');
 if(heading)heading.textContent=verified?'Mây Spa đã nhận lịch đặt của bạn!':'Yêu cầu đặt lịch đã được gửi!';
 const description=bookingModal?.querySelector('.booking-modal-panel p:not(#booking-success-detail)');
 if(description)description.textContent=verified?'Mây Spa đã nhận được lịch hẹn. Bạn có thể đến spa đúng lịch đã đặt nhé!':'Thông tin đặt lịch đã được gửi đến Mây Spa. Nếu cần kiểm tra lịch, vui lòng gọi Mây: 0911 400 718.';
 if(bookingModal){bookingModal.hidden=false;document.body.style.overflow='hidden';bookingModalClose?.focus()}
 status.textContent=verified?'Mây Spa đã ghi nhận lịch đặt.':'Yêu cầu đặt lịch đã được gửi; chưa xác minh phản hồi lưu dữ liệu.';
 status.style.color=verified?'#087b45':'#617167';
 if(verified)track('generate_lead',{lead_type:'booking_request',booking_status:'cho_xac_nhan'});
 form?.reset();setupBookingSlots();
 const button=form?.querySelector('button[type=submit]');if(button){button.disabled=false;button.textContent='Gửi yêu cầu đặt lịch →'}
}
window.addEventListener('message',e=>{
 if(!awaitingLeadResponse||!activeRequestId)return;
 if(e.origin!=='null'){
  let origin;try{origin=new URL(e.origin)}catch(_){return}
  if(origin.protocol!=='https:'||!(origin.hostname==='script.google.com'||origin.hostname.endsWith('.googleusercontent.com')))return;
 }
 let result=e.data;
 if(typeof result==='string'){try{result=JSON.parse(result)}catch(_){return}}
 if(!result||result.app!=='may_spa_booking'||result.request_id!==activeRequestId)return;
 if(result.ok===true&&result.code==='SAVED'&&result.booking_id){showBookingNotice(true);return}
 if(bookingTimer){clearTimeout(bookingTimer);bookingTimer=null}
 awaitingLeadResponse=false;submitting=false;activeRequestId='';
 const button=form?.querySelector('button[type=submit]');if(button){button.disabled=false;button.textContent='Gửi yêu cầu đặt lịch →'}
 status.textContent='Chưa thể tiếp nhận lịch đặt. Vui lòng kiểm tra hoặc gọi Mây: 0911 400 718.';status.style.color='#8a5b1d';
});

form?.addEventListener('submit',e=>{
 if(submitting){e.preventDefault();return}
 const p=phone.value.trim();
 if(!nameInput?.value.trim()){e.preventDefault();if(nameErr)nameErr.textContent='Vui lòng nhập họ và tên.';nameInput?.focus();return}
 const now=spaNow();
 if(!bookingDate.value||bookingDate.value<localDateString(now)||bookingDate.value>bookingDate.max){e.preventDefault();$('#booking-date-error').textContent='Vui lòng chọn ngày hợp lệ trong 30 ngày tới.';bookingDate.focus();return}
 setupBookingSlots();
 if(!bookingTime.value){e.preventDefault();$('#booking-time-error').textContent='Vui lòng chọn khung giờ còn trong danh sách.';bookingTime.focus();return}
 track('booking_request_submit',{booking_date:bookingDate.value,booking_time:bookingTime.value,booking_status:'cho_xac_nhan'});
 if(!validPhone(p)){
   e.preventDefault();
   phoneErr.textContent='Vui lòng nhập số điện thoại hợp lệ.';
   phone.focus();
   return;
 }
 activeRequestId=(typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function')?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
 requestField.value=activeRequestId;
 bookingDone=false;
 bookingDateSent=bookingDate.value;
 bookingTimeSent=bookingTime.value;
 submitting=true;
 awaitingLeadResponse=true;
 const btn=form.querySelector('button[type=submit]');
 btn.disabled=true;
 btn.textContent='Đang gửi...';
 status.textContent='Đang gửi thông tin đến Mây...';
 status.style.color='#617167';
 // The 3-second fallback confirms submission only, not Sheet persistence.
 bookingTimer=setTimeout(()=>{if(awaitingLeadResponse)showBookingNotice(false)},3000);
});
