const CONFIG={
  FORM_ENDPOINT:"",
  MAPS_URL:"https://maps.app.goo.gl/wmgvvp46ANbGNgso7",
  MAPS_EMBED_URL:"",
  ZALO_URL:"https://zalo.me/0911400718",
  GTM_ID:"",
  GA4_ID:"",
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
function track(name,params={}){window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:name,...params});if(typeof window.gtag==='function')window.gtag('event',name,params)}
$$('[data-track]').forEach(el=>el.addEventListener('click',()=>track(el.dataset.track,{label:el.textContent.trim(),source:el.dataset.bookingSource||el.id||''})));
$('#year').textContent=new Date().getFullYear();

function configureExternalLinks(){
 const mapsEls=[$('#maps-direction'),$('#maps-review'),$('#maps-float'),$('#maps-mobile')].filter(Boolean);
 if(CONFIG.MAPS_URL){mapsEls.forEach(el=>{el.href=CONFIG.MAPS_URL;el.target='_blank';el.rel='noopener'})}
 else {mapsEls.forEach(el=>el.addEventListener('click',e=>{if(el.getAttribute('href')==='#')e.preventDefault()}))}
 const z=[$('#zalo-float'),$('#zalo-mobile')].filter(Boolean);if(CONFIG.ZALO_URL){z.forEach(el=>{el.href=CONFIG.ZALO_URL;el.target='_blank';el.rel='noopener'})}
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

const form=$('#lead-form'), status=$('#form-status'), phone=$('#phone'), phoneErr=$('#phone-error'), leadTarget=$('#lead-submit-target');
let submitting=false, awaitingLeadResponse=false;
function validPhone(v){return /^(0|\+84)[0-9\s.()-]{8,14}$/.test(v.trim())}
phone?.addEventListener('input',()=>{phoneErr.textContent='';if(!phone.dataset.started){phone.dataset.started='1';track('form_start')}});

leadTarget?.addEventListener('load',()=>{
 if(!awaitingLeadResponse)return;
 awaitingLeadResponse=false;
 submitting=false;
 const btn=form?.querySelector('button[type=submit]');
 if(btn){btn.disabled=false;btn.textContent='Gửi yêu cầu tư vấn →'}
 status.textContent='Mây đã nhận thông tin 💚 Mây sẽ liên hệ lại để kiểm tra nhu cầu và tư vấn mức chăm sóc phù hợp.';
 status.style.color='#0d7a43';
 form?.reset();
 track('form_submit',{mode:'apps_script_google_form'});
 track('generate_lead');
});

form?.addEventListener('submit',e=>{
 if(submitting){e.preventDefault();return}
 const p=phone.value.trim();
 if(!validPhone(p)){
   e.preventDefault();
   phoneErr.textContent='Vui lòng nhập số điện thoại hợp lệ.';
   phone.focus();
   return;
 }
 submitting=true;
 awaitingLeadResponse=true;
 const btn=form.querySelector('button[type=submit]');
 btn.disabled=true;
 btn.textContent='Đang gửi...';
 status.textContent='Đang gửi thông tin đến Mây...';
 status.style.color='#617167';
 // Native POST goes to the deployed Apps Script web app in a hidden iframe.
 // Apps Script submits a real response into the connected Google Form, which then writes to Google Sheets.
 setTimeout(()=>{
   if(awaitingLeadResponse){
     awaitingLeadResponse=false;
     submitting=false;
     btn.disabled=false;
     btn.textContent='Gửi yêu cầu tư vấn →';
     status.textContent='Nếu chưa thấy xác nhận, vui lòng thử lại hoặc gọi Mây: 0911 400 718.';
     status.style.color='#8a5b1d';
   }
 },10000);
});

