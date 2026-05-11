/* script.js
 - site navigation (hash-based)
 - simple search, carousel controls
 - department JS object with phone numbers
 - sessionStorage usage for last visited page & saved contact submissions
*/

// --- Helpers ---
const pages = ['home','help','contact','terms'];
function showPage(id){
  pages.forEach(p => {
    const el = document.getElementById(p);
    const nav = document.getElementById('nav-' + p);
    if(!el) return;
    if(p === id){ el.classList.add('active'); if(nav) nav.classList.add('active'); }
    else { el.classList.remove('active'); if(nav) nav.classList.remove('active'); }
  });
  // persist last visited
  sessionStorage.setItem('lastPage', id);
}

// on load: navigate to hash or remembered
window.addEventListener('DOMContentLoaded', () => {
  const hash = (location.hash || '#'+(sessionStorage.getItem('lastPage') || 'home')).replace('#','');
  showPage(pages.includes(hash) ? hash : 'home');

  // attach nav links to update hash and show page
  pages.forEach(p => {
    const link = document.getElementById('nav-' + p);
    if(link) link.addEventListener('click', (e)=>{
      e.preventDefault();
      location.hash = p;
      showPage(p);
    });
  });

  // handle direct hash changes
  window.addEventListener('hashchange', ()=> {
    const id = location.hash.replace('#','') || 'home';
    showPage(id);
  });

  // initialize search
  initSearch();

  // carousel
  initCarousel();

  // populate department table & contact form logic
  initContact();

  // restore contact submissions list preview
  renderSavedContacts();
});

// --- Search (local mock) ---
const items = [
  {title:'Wireless Headphones'},
  {title:'Vintage Camera'},
  {title:'Sneakers'},
  {title:'Portable Speaker'},
  {title:'Designer Handbag'},
  {title:'Drone'},
  {title:'Record Player'}
];
function initSearch(){
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  searchBtn.addEventListener('click', ()=> performSearch(searchInput.value));
  searchInput.addEventListener('keydown', (e)=> { if(e.key === 'Enter') performSearch(searchInput.value) });
}
function performSearch(q){
  q = (q || '').trim().toLowerCase();
  const grid = document.getElementById('popularGrid');
  if(!grid) return;
  if(!q){ grid.innerHTML = defaultPopularHTML(); return; }
  const results = items.filter(i => i.title.toLowerCase().includes(q));
  if(results.length === 0){
    grid.innerHTML = '<div style="grid-column:1/-1;padding:18px;color:var(--muted)">No results found.</div>';
    return;
  }
  grid.innerHTML = results.map(r => `
    <div class="card">
      <img src="https://picsum.photos/seed/${encodeURIComponent(r.title)}/400/200" alt="">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
        <div><div style="font-weight:600">${r.title}</div><div style="font-size:13px;color:var(--muted)">Item</div></div>
        <div class="price">$${(Math.random()*120+20).toFixed(2)}</div>
      </div>
    </div>`).join('');
}
function defaultPopularHTML(){
  return `
  <div class="card">
    <img src="https://picsum.photos/seed/1/400/200" alt="item 1">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
      <div><div style="font-weight:600">Wireless Headphones</div><div style="font-size:13px;color:var(--muted)">Brand refurbished</div></div><div class="price">$49.99</div>
    </div>
  </div>
  <div class="card">
    <img src="https://picsum.photos/seed/2/400/200" alt="item 2">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
      <div><div style="font-weight:600">Vintage Camera</div><div style="font-size:13px;color:var(--muted)">Collector item</div></div><div class="price">$129.00</div>
    </div>
  </div>
  <div class="card">
    <img src="https://picsum.photos/seed/3/400/200" alt="item 3">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
      <div><div style="font-weight:600">Sneakers</div><div style="font-size:13px;color:var(--muted)">New with tags</div></div><div class="price">$79.00</div>
    </div>
  </div>`;
}

// --- Carousel ---
function initCarousel(){
  const track = document.getElementById('carouselTrack');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if(!track || !prev || !next) return;
  let idx = 0;
  const cards = track.children.length;
  function update(){ track.style.transform = `translateX(${-idx * 170}px)`; }
  prev.addEventListener('click', ()=> { idx = Math.max(0, idx-1); update(); });
  next.addEventListener('click', ()=> { idx = Math.min(cards-1, idx+1); update(); });
  track.style.willChange = 'transform';
}

// --- Contact: JS object with departments & random phone numbers, sessionStorage for saved submissions ---
function randomPhone(){
  // US-style random phone for demo
  const a = Math.floor(200 + Math.random()*700);
  const b = Math.floor(100 + Math.random()*800);
  const c = Math.floor(1000 + Math.random()*9000);
  return `+1 (${a}) ${b}-${c}`;
}

// JS Object describing departments (required)
const departments = {
  "Customer Support": { hours: "24/7", phone: randomPhone() },
  "Seller Support": { hours: "Mon-Fri 9am-6pm", phone: randomPhone() },
  "Payments":       { hours: "Mon-Fri 8am-8pm", phone: randomPhone() },
  "Legal":          { hours: "Mon-Fri 9am-5pm", phone: randomPhone() }
};

function initContact(){
  populateDeptTable();
  const form = document.getElementById('contactForm');
  const savedEl = document.getElementById('contactSaved');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = {
      name: form.name.value,
      email: form.email.value,
      dept: form.dept.value,
      message: form.message.value,
      submitted: new Date().toISOString()
    };
    saveContactSubmission(data);
    form.reset();
    if(savedEl) savedEl.textContent = 'Message submitted and saved to session (demo).';
    renderSavedContacts();
  });
}

function populateDeptTable(){
  const tbody = document.querySelector('#deptTable tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  Object.keys(departments).forEach(key => {
    const d = departments[key];
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${key}</td><td>${d.phone}</td><td>${d.hours}</td>`;
    tbody.appendChild(tr);
  });
}

// Session storage of contact submissions (demo)
const STORAGE_KEY = 'mock_contact_submissions';
function saveContactSubmission(obj){
  const arr = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
  arr.unshift(obj);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0,20))); // keep up to 20
}
function renderSavedContacts(){
  const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
  const container = document.getElementById('contactSaved');
  if(!container) return;
  if(saved.length === 0){ container.textContent = 'No saved contact messages in this session.'; return; }
  // render a small table
  let html = '<div style="margin-top:12px"><strong>Recent messages (session)</strong><div style="overflow:auto;margin-top:8px">';
  html += '<table class="table table-sm"><thead><tr><th>Name</th><th>Dept</th><th>When</th></tr></thead><tbody>';
  saved.slice(0,5).forEach(s => {
    html += `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.dept)}</td><td>${new Date(s.submitted).toLocaleString()}</td></tr>`;
  });
  html += '</tbody></table></div></div>';
  container.innerHTML = html;
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

// --- Accessibility tiny touches ---
document.addEventListener('keydown', (e) => {
  if(e.key === 'h' && e.altKey){ location.hash = 'help'; showPage('help'); }
});

// store last visited page on unload (redundant with showPage but safe)
window.addEventListener('beforeunload', ()=> {
  const current = location.hash.replace('#','') || 'home';
  sessionStorage.setItem('lastPage', current);
});
