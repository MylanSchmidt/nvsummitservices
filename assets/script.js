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

openBtns.forEach(btn => {
  const id = btn.getAttribute('data-open');

  // ✅ IMPORTANT: class-register-modal is handled by the Stripe section below
  if (id === 'class-register-modal') return;

  const modal = document.getElementById(id);
  if (!modal) return;

  btn.addEventListener('click', () => {
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

// ============================================
// STRIPE PAYMENT LINKS FOR CLASS REGISTRATION
// (Supports per-class price + CEU via data-price / data-ceu)
// Requires these IDs in the modal:
// - modal-class-name, modal-class-date, modal-class-price, modal-class-ceu
// - stripe-payment-button
// - payment-required-section, registration-form-section
// - stripe-session-id, form-class-name, form-class-date
// - form-amount-paid, form-ceu-credits
// ============================================

// Helper: update modal UI + hidden fields from a class payload
function applyClassDataToModal(classData) {
  if (!classData) return;

  const name = classData.name || '';
  const date = classData.date || '';
  const paymentLink = classData.paymentLink || '';
  const price = Number(classData.price ?? 75);
  const ceu = Number(classData.ceu ?? 3);

  // Text fields
  const modalClassName = document.getElementById('modal-class-name');
  const modalClassDate = document.getElementById('modal-class-date');
  if (modalClassName) modalClassName.textContent = name;
  if (modalClassDate) modalClassDate.textContent = date;

  // Price + CEU display
  const priceEl = document.getElementById('modal-class-price');
  if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;

  const ceuEl = document.getElementById('modal-class-ceu');
  if (ceuEl) ceuEl.textContent = `${ceu} NRED-approved CE credit${ceu === 1 ? '' : 's'}`;

  // Stripe pay button href + label
  const payBtn = document.getElementById('stripe-payment-button');
  if (payBtn) {
    payBtn.href = paymentLink;
    payBtn.textContent = `Pay $${price} with Stripe →`;
  }

  // Hidden form fields for submission
  const formClassName = document.getElementById('form-class-name');
  const formClassDate = document.getElementById('form-class-date');
  if (formClassName) formClassName.value = name;
  if (formClassDate) formClassDate.value = date;

  const amtPaid = document.getElementById('form-amount-paid');
  if (amtPaid) amtPaid.value = `$${price.toFixed(2)}`;

  const ceuHidden = document.getElementById('form-ceu-credits');
  if (ceuHidden) ceuHidden.value = String(ceu);
}

// Override the existing modal open behavior for class registration
document.querySelectorAll('[data-open="class-register-modal"]').forEach(btn => {
  btn.addEventListener('click', function (e) {
    // Prevent the default modal opening
    e.stopImmediatePropagation();

    // Get class details (defaults keep your current behavior if attributes missing)
    const className = this.getAttribute('data-class') || '';
    const classDate = this.getAttribute('data-date') || '';
    const paymentLink = this.getAttribute('data-payment-link') || '';
    const price = Number(this.getAttribute('data-price') || 75);
    const ceu = Number(this.getAttribute('data-ceu') || 3);

    const classPayload = {
      name: className,
      date: classDate,
      paymentLink,
      price,
      ceu,
      timestamp: Date.now()
    };

    // Store in sessionStorage so it persists after Stripe redirect
    sessionStorage.setItem('selectedClass', JSON.stringify(classPayload));

    // ALSO store in localStorage as backup
    localStorage.setItem('pendingClassRegistration', JSON.stringify(classPayload));

    // Update modal content from payload
    applyClassDataToModal(classPayload);

    // Only run return logic if the URL actually indicates a Stripe return
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && params.get('session_id')) {
      checkForPaymentReturn();
    } else {
      // Fresh click: ensure we're in payment step (not the post-payment form)
      const paymentSection = document.getElementById('payment-required-section');
      const registrationSection = document.getElementById('registration-form-section');
      if (paymentSection) paymentSection.style.display = 'block';
      if (registrationSection) registrationSection.style.display = 'none';
    }

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
  const paymentSection = document.getElementById('payment-required-section');
  const registrationSection = document.getElementById('registration-form-section');

  if (paymentStatus === 'success' && sessionId) {
    // Show registration form, hide payment section
    if (paymentSection) paymentSection.style.display = 'none';
    if (registrationSection) registrationSection.style.display = 'block';

    // Store session ID in hidden field
    const sessionField = document.getElementById('stripe-session-id');
    if (sessionField) sessionField.value = sessionId;

    // Try to retrieve class info from sessionStorage first
    let classData = null;
    const storedClass = sessionStorage.getItem('selectedClass');

    if (storedClass) {
      try {
        classData = JSON.parse(storedClass);
      } catch (err) {
        console.error('❌ Failed to parse selectedClass from sessionStorage', err);
      }
    }

    // Fallback to localStorage
    if (!classData) {
      const localData = localStorage.getItem('pendingClassRegistration');
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          // Only use if less than 10 minutes old
          if (parsed?.timestamp && Date.now() - parsed.timestamp < 600000) {
            classData = parsed;
          }
        } catch (err) {
          console.error('❌ Failed to parse pendingClassRegistration from localStorage', err);
        }
      }
    }

    if (classData) {
      // Restore modal + hidden fields (including price/ceu)
      applyClassDataToModal(classData);
      console.log('✅ Class data restored successfully:', classData);
    } else {
      console.error('❌ No class data found - user may have returned without starting from class list');
    }

    // Clean up URL without reloading
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    return true;
  }

  // Not returning from Stripe: Show payment section, hide registration form
  if (paymentSection) paymentSection.style.display = 'block';
  if (registrationSection) registrationSection.style.display = 'none';

  return false;
}

// On page load, check if we're returning from payment
window.addEventListener('DOMContentLoaded', function () {
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
document.getElementById('class-registration-form')?.addEventListener('submit', function () {
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
  
  if (dateInput) {
    dateInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
      let formattedValue = '';

      if (value.length > 0) {
        // Month Logic (limit to 1-12)
        let month = value.substring(0, 2);
        if (month.length === 1) {
          // If first digit is 2-9, it must be a single digit month (02-09)
          if (parseInt(month) > 1) {
            month = '0' + month;
            value = month + value.substring(1);
          }
        } else if (month.length === 2) {
          // Validate month is between 01-12
          let monthNum = parseInt(month);
          if (monthNum > 12) {
            month = '12'; // Cap at 12
            value = month + value.substring(2);
          } else if (monthNum === 0) {
            month = '01'; // Minimum of 01
            value = month + value.substring(2);
          }
        }
        
        if (month.length === 2) {
          formattedValue += month + '/';
        } else {
          formattedValue += month;
        }

        // Day Logic (limit to 1-31)
        if (value.length > 2) {
          let day = value.substring(2, 4);
          if (day.length === 1) {
            // If first digit is 4-9, it must be single digit day (04-09)
            if (parseInt(day) > 3) {
              day = '0' + day;
              value = value.substring(0, 2) + day + value.substring(3);
            }
          } else if (day.length === 2) {
            // Validate day is between 01-31
            let dayNum = parseInt(day);
            if (dayNum > 31) {
              day = '31'; // Cap at 31
              value = value.substring(0, 2) + day + value.substring(4);
            } else if (dayNum === 0) {
              day = '01'; // Minimum of 01
              value = value.substring(0, 2) + day + value.substring(4);
            }
          }
          
          if (day.length === 2) {
            formattedValue += day + '/';
          } else {
            formattedValue += day;
          }
        }

        // Year Logic
        if (value.length > 4) {
          let year = value.substring(4, 8);
          formattedValue += year;
        }
      }

      e.target.value = formattedValue;
    });

    // Handle backspace properly to prevent getting stuck on slashes
    dateInput.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace') {
        const val = e.target.value;
        if (val.endsWith('/')) {
          e.preventDefault();
          e.target.value = val.substring(0, val.length - 1);
        }
      }
    });
  }
});