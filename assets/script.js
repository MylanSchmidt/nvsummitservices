// Main site JavaScript - handles navigation, modals, and form submissions

const navToggle=document.querySelector('[data-nav-toggle]');
const navList=document.querySelector('[data-nav]');
const header=document.querySelector('[data-header]');
if(navToggle&&navList){
  navToggle.addEventListener('click',()=>
    {const open=navList.getAttribute('data-open')==='true';
      navList.setAttribute('data-open',String(!open));
      navToggle.setAttribute('aria-expanded',String(!open)
    );});}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id&&id.length>1){
      const el=document.querySelector(id);
      if(el){e.preventDefault();
        el.scrollIntoView({
          behavior:'smooth',block:'start'});
          navList?.setAttribute('data-open','false');
          navToggle?.setAttribute('aria-expanded','false');
        }}});});
let lastY=0;
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  if(!header)return;
  if(y>10&&lastY<=10)header.classList.add('scrolled');
  else if(y<=10&&lastY>10)header.classList.remove('scrolled');
  lastY=y;
});
const io=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(entry.isIntersecting){entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }}},{threshold:.12});
    document.querySelectorAll('[data-observe]').forEach(el=>io.observe(el));
const openBtns=document.querySelectorAll('[data-open]');
const closeBtns=document.querySelectorAll('[data-close]');
openBtns.forEach(btn=>{const id=btn.getAttribute('data-open');
  const modal=document.getElementById(id);
  if(!modal)return;
  btn.addEventListener('click',()=>modal.showModal());
});
closeBtns.forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('dialog[open]').forEach(m=>m.close());
}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')
  document.querySelectorAll('dialog[open]').forEach(m=>m.close());
});

// Web3Forms AJAX submit with pop-out confirmation for all forms (modals AND inline)
document.querySelectorAll('form.stack').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Remove any previous confirmation
    document.querySelectorAll('.form-confirm').forEach(el => el.remove());

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      // Close modal if open
      const dialog = form.closest('dialog');
      if (dialog && typeof dialog.close === 'function') {
        dialog.close();
      }

      // Confirmation message (always outside modal, as pop-out)
      const confirmMsg = document.createElement('div');
      confirmMsg.className = 'form-confirm';
      confirmMsg.innerHTML = `
        <div class="card" style="padding:2rem; text-align:center; position:fixed; left:50%; top:20%; transform:translate(-50%,0); z-index:9999; box-shadow: 0 4px 32px rgba(0,0,0,.16);">
          <h3 class="h4">${data.success ? "Thank you!" : "Sorry!"}</h3>
          <p>${data.success ? "Your message has been received.<br>We will get back to you soon." : "There was an error sending your message.<br>Please try again or email us directly."}</p>
          <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
      `;
      form.reset();
      document.body.appendChild(confirmMsg);
    })
    .catch(() => {
      // Network error handler
      const confirmMsg = document.createElement('div');
      confirmMsg.className = 'form-confirm';
      confirmMsg.innerHTML = `
        <div class="card" style="padding:2rem; text-align:center; position:fixed; left:50%; top:20%; transform:translate(-50%,0); z-index:9999; box-shadow: 0 4px 32px rgba(0,0,0,.16);">
          <h3 class="h4">Sorry!</h3>
          <p>There was a network error.<br>
          Please try again later.</p>
          <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
      `;
      document.body.appendChild(confirmMsg);
    });
  });
});

// Open/close modal (safe, delegated)
document.addEventListener('click', (e) => {
  const open = e.target.closest('[data-modal]');
  if (open) {
    e.preventDefault();
    document.querySelector(open.getAttribute('data-modal'))?.showModal?.();
  }
  if (e.target.closest('[data-close]')) {
    e.preventDefault();
    e.target.closest('dialog')?.close?.();
  }
});

// Optional: close on backdrop click
document.querySelectorAll('dialog').forEach(dlg => {
  dlg.addEventListener('click', (e) => {
    const r = dlg.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) dlg.close();
  });
});

// AJAX submit (keeps user on page)
document.querySelectorAll('form[action*="api.web3forms.com/submit"]').forEach(form => {
  if (form.dataset.w3bound) return; form.dataset.w3bound = "1";
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]'); const txt = btn?.textContent;
    if (btn){ btn.disabled = true; btn.textContent = 'Sending…'; }
    try {
      const res = await fetch(form.action, { method:'POST', headers:{'Accept':'application/json'}, body:new FormData(form) });
      if (res.ok){ form.reset(); alert('Thanks! Your request was sent.'); form.closest('dialog')?.close?.(); }
      else{ alert('Sorry—something went wrong. Please try again or email info@nvsummitservices.com.'); }
    } catch { alert('Network error. Please try again.'); }
    finally { if (btn){ btn.disabled = false; btn.textContent = txt || 'Request Demand Letter'; } }
  });
});