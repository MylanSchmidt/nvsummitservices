// Everything here stays the same; this script works for both index.html and handhlegal.html

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

openBtns.forEach(btn=>{
  const id = btn.getAttribute('data-open');
  const modal = document.getElementById(id);
  if(!modal) return;

  btn.addEventListener('click', () => {
    // Special handling for class registration modal: auto-fill fields
    if (id === 'class-register-modal') {
      const cls  = btn.getAttribute('data-class') || '';
      const date = btn.getAttribute('data-date') || '';

      const classField = modal.querySelector('input[name="Class"]');
      const dateField  = modal.querySelector('input[name="Date"]');

      if (classField) classField.value = cls;
      if (dateField)  dateField.value  = date;
    }

    modal.showModal();
  });
});

closeBtns.forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('dialog[open]').forEach(m=>m.close());
}));


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

      // Is this the Class Registration modal?
      const isClassRegistration = !!form.closest('#class-register-modal');

      const heading = data.success ? "Thank you!" : "Sorry!";
      const message = data.success
        ? (
            isClassRegistration
              ? "Thank you for registering.<br>We look forward to seeing you at the class!"
              : "Your message has been received.<br>We will get back to you soon."
          )
        : "There was an error sending your message.<br>Please try again or email us directly.";

      // Confirmation message (always outside modal, as pop-out)
      const confirmMsg = document.createElement('div');
      confirmMsg.className = 'form-confirm';
      confirmMsg.innerHTML = `
        <div class="card" style="padding:2rem; text-align:center; position:fixed; left:50%; top:20%; transform:translate(-50%,0); z-index:9999; box-shadow: 0 4px 32px rgba(0,0,0,.16);">
          <h3 class="h4">${heading}</h3>
          <p>${message}</p>
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


// Make service cards clickable as full tiles, while keeping buttons functional
document.querySelectorAll('.service-card[data-link]').forEach(function(card) {
  var target = card.getAttribute('data-link');
  if (!target) return;

  // Click on empty card area -> navigate
  card.addEventListener('click', function(e) {
    // If they clicked on a button or link inside, let that handle itself
    if (e.target.closest('button, a')) return;
    
    // Check if it's an external link (starts with http:// or https://)
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = target;
    }
  });

  // Keyboard accessibility (Enter / Space)
  card.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button, a')) {
      e.preventDefault();
      
      // Check if it's an external link
      if (target.startsWith('http://') || target.startsWith('https://')) {
        window.open(target, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = target;
      }
    }
  });

  // Make card focusable and announce it as a link
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'link');
  var heading = card.querySelector('h3');
  if (heading && heading.textContent) {
    card.setAttribute('aria-label', heading.textContent.trim() + ' – learn more');
  }
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


// ============================================
// STRIPE PAYMENT LINKS FOR CLASS REGISTRATION
// ============================================

// Override the existing modal open behavior for class registration
document.querySelectorAll('[data-open="class-register-modal"]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // Prevent the default modal opening
    e.stopImmediatePropagation();
    
    // Get class details
    const className = this.getAttribute('data-class') || '';
    const classDate = this.getAttribute('data-date') || '';
    const paymentLink = this.getAttribute('data-payment-link') || '';
    
    // Store in sessionStorage so it persists after Stripe redirect
    sessionStorage.setItem('selectedClass', JSON.stringify({
      name: className,
      date: classDate,
      paymentLink: paymentLink
    }));
    
    // ALSO store in localStorage as backup
    localStorage.setItem('pendingClassRegistration', JSON.stringify({
      name: className,
      date: classDate,
      timestamp: Date.now()
    }));
    
    // Update modal content
    document.getElementById('modal-class-name').textContent = className;
    document.getElementById('modal-class-date').textContent = classDate;
    document.getElementById('stripe-payment-button').href = paymentLink;
    
    // Store in hidden form fields
    document.getElementById('form-class-name').value = className;
    document.getElementById('form-class-date').value = classDate;
    
    // Check if returning from payment
    checkForPaymentReturn();
    
    // Open the modal
    const modal = document.getElementById('class-register-modal');
    if (modal) modal.showModal();
  });
});

// Check if user is returning from Stripe payment
function checkForPaymentReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');
  const sessionId = urlParams.get('session_id');
  
  if (paymentStatus === 'success' && sessionId) {
    // Show registration form, hide payment section
    document.getElementById('payment-required-section').style.display = 'none';
    document.getElementById('registration-form-section').style.display = 'block';
    
    // Store session ID in hidden field
    document.getElementById('stripe-session-id').value = sessionId;
    
    // Try to retrieve class info from sessionStorage first
    let classData = null;
    const storedClass = sessionStorage.getItem('selectedClass');
    
    if (storedClass) {
      classData = JSON.parse(storedClass);
    } else {
      // Fallback to localStorage
      const localData = localStorage.getItem('pendingClassRegistration');
      if (localData) {
        const parsed = JSON.parse(localData);
        // Only use if less than 10 minutes old
        if (Date.now() - parsed.timestamp < 600000) {
          classData = parsed;
        }
      }
    }
    
    if (classData) {
      // Update modal display
      const modalClassName = document.getElementById('modal-class-name');
      const modalClassDate = document.getElementById('modal-class-date');
      const formClassName = document.getElementById('form-class-name');
      const formClassDate = document.getElementById('form-class-date');
      
      if (modalClassName) modalClassName.textContent = classData.name;
      if (modalClassDate) modalClassDate.textContent = classData.date;
      if (formClassName) formClassName.value = classData.name;
      if (formClassDate) formClassDate.value = classData.date;
      
      console.log('✅ Class data restored successfully:', classData);
    } else {
      console.error('❌ No class data found - this should not happen');
    }
    
    // Clean up URL without reloading
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    
    return true;
  }
  
  // Show payment section, hide registration form
  document.getElementById('payment-required-section').style.display = 'block';
  document.getElementById('registration-form-section').style.display = 'none';
  
  return false;
}

// On page load, check if we're returning from payment
window.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');
  const sessionId = urlParams.get('session_id');
  
  if (paymentStatus === 'success' && sessionId) {
    // Auto-open the registration modal
    const modal = document.getElementById('class-register-modal');
    if (modal) {
      // Populate the modal first
      checkForPaymentReturn();
      // Then open it
      setTimeout(() => modal.showModal(), 100);
    }
  }
});

// Clean up storage after successful form submission
document.getElementById('class-registration-form')?.addEventListener('submit', function(e) {
  // Clear the stored class data after successful submission
  setTimeout(() => {
    sessionStorage.removeItem('selectedClass');
    localStorage.removeItem('pendingClassRegistration');
  }, 1000);
  // The existing form handler in script.js will handle the rest
});


// ============================================
// AUTO-FORMATTING DATE INPUT FOR RESERVE STUDIES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('last-study-date');
  
  if (!dateInput) return;
  
  dateInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    let formatted = '';
    
    if (value.length === 0) {
      e.target.value = '';
      return;
    }
    
    // Month (first 1-2 digits)
    if (value.length === 1) {
      // Single digit month: pad and add slash
      formatted = '0' + value + '/';
    } else if (value.length >= 2) {
      // Two digit month
      let month = value.substring(0, 2);
      formatted = month + '/';
      
      // Day (next 1-2 digits)
      if (value.length === 3) {
        // Single digit day: pad and add slash
        let day = value.substring(2, 3);
        formatted += '0' + day + '/';
      } else if (value.length >= 4) {
        // Two digit day
        let day = value.substring(2, 4);
        formatted += day + '/';
        
        // Year (remaining digits, up to 4)
        if (value.length > 4) {
          let year = value.substring(4, Math.min(8, value.length));
          
          // Auto-expand 2-digit year to 4-digit (assume 2000s)
          if (year.length === 2) {
            year = '20' + year;
          }
          formatted += year;
        }
      }
    }
    
    e.target.value = formatted;
  });
  
  // Handle backspace for slashes
  dateInput.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace') {
      const value = e.target.value;
      if (value.endsWith('/')) {
        e.preventDefault();
        e.target.value = value.slice(0, -1);
      }
    }
  });
  
  // Validate on blur
  dateInput.addEventListener('blur', function(e) {
    const value = e.target.value;
    if (value.length === 10) {
      const parts = value.split('/');
      const month = parseInt(parts[0]);
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      
      // Basic validation
      if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) {
        alert('Please enter a valid date (MM/DD/YYYY)');
        e.target.value = '';
      }
    }
  });
});