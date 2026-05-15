
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

// --- Search ---
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
  if (q === "items") {
  grid.innerHTML = ITEMS.slice(0, 10).map(it => {
    const price = priceForCategory(it.category);
    const imgSrc = it.image || 'images/lock.jpg';
    return `
      <div class="card">
        <img src="${imgSrc}" alt="${it.name}" style="width:100%;height:160px;object-fit:cover;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div>
            <div style="font-weight:600">${it.name}</div>
            <div style="font-size:13px;color:var(--muted)">${it.category}</div>
          </div>
          <div class="price">${formatUSD(price)}</div>
        </div>
      </div>
    `;
  }).join('');
  return;

  }
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

// --- Contact ---
function randomPhone(){
  // random +1 phone numbers
  const a = Math.floor(200 + Math.random()*700);
  const b = Math.floor(100 + Math.random()*800);
  const c = Math.floor(1000 + Math.random()*9000);
  return `+1 (${a}) ${b}-${c}`;
}

// Departments
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

// Session storage of contact submissions
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

// --- Accessibility ---
document.addEventListener('keydown', (e) => {
  if(e.key === 'h' && e.altKey){ location.hash = 'help'; showPage('help'); }
});

// --- store last visited ---
window.addEventListener('beforeunload', ()=> {
  const current = location.hash.replace('#','') || 'home';
  sessionStorage.setItem('lastPage', current);
});

// --- random pricing ---

const PRICE_RANGES = {
  laptop: [300, 2200],
  headphones: [20, 450],
  keyboard: [20, 250],
  phone: [90, 900],
  chair: [60, 500],
  shoes: [25, 220],
  book: [5, 35],
  mug: [4, 22],
  monitor: [70, 260],
  default: [5, 250]
};

// --- photos ---
const ITEMS = [
  { name: "Gaming Laptop", category: "laptop", image: "images/laptop.png" },
  { name: "Wireless Headphones", category: "headphones", image: "images/Headphones.jpg" },
  { name: "Mechanical Keyboard", category: "keyboard", image: "images/Keyboard.jpg" },
  { name: "Ergonomic Office Chair", category: "chair", image: "images/Chair.jpg" },
  { name: "Running Shoes", category: "shoes", image: "images/running.jpg" },
  { name: "Ceramic Coffee Mug", category: "mug", image: "images/mug.jpg" },
  { name: "Paperback Novel", category: "book", image: "images/paperback.jpg" },
  { name: "Smartphone", category: "phone", image: "images/phone.jpg" },
  { name: "Monitor", category: "monitor", image: "images/monitor.jpg" },
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function priceForCategory(category) {
  const key = (category || "").toLowerCase();
  const [min, max] = PRICE_RANGES[key] || PRICE_RANGES.default;

  // random pricing through set
  const base = randInt(min, max);
  const cents = Math.random() < 0.7 ? 0.99 : 0.0;
  return Math.round(base) + cents;
}

function formatUSD(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

function pickRandomUnique(pool, count, excludeSet = new Set()) {
  const candidates = pool.filter(x => !excludeSet.has(x));
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  return candidates.slice(0, count);
}

function buildPricedItems(items) {
  // render pricing
  return items.map(item => ({
    ...item,
    price: priceForCategory(item.category)
  }));
}

function renderResults(items) {
  const resultsEl = document.getElementById("results");
  if (!resultsEl) return;

  resultsEl.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.loading = "lazy";
    img.onerror = () => console.log("IMAGE FAILED:", img.src);
      img.style.height = "160px";

    const body = document.createElement("div");
    body.className = "product-body";

    const title = document.createElement("p");
    title.className = "product-title";
    title.textContent = item.name;

    const meta = document.createElement("p");
    meta.className = "product-meta";
    meta.textContent = item.category;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatUSD(item.price);

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(price);

    card.appendChild(img);
    card.appendChild(body);
    resultsEl.appendChild(card);
  });
}
  // was ten but set to 9 for sleek look
function searchAndShowTen(query) {
  const q = normalize(query);

  const matches = ITEMS.filter(item => {
    const hay = `${item.name} ${item.category}`.toLowerCase();
    return q.length === 0 ? true : hay.includes(q);
  });

  // Always show exactly 10 results, later made 9 and static
  const first = matches.slice(0, 9);
  const used = new Set(first);

  if (first.length < 10) {
    const filler = pickRandomUnique(ITEMS, 10 - first.length, used);
    first.push(...filler);
  }

  renderResults(buildPricedItems(first));
}
{
function initTenItemGrid() {
  const btn = document.getElementById("searchBtn");     
  const input = document.getElementById("searchInput"); 

  if (btn && input) {
    btn.addEventListener("click", () => searchAndShowTen(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") searchAndShowTen(input.value);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initTenItemGrid();
});

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      searchAndShowTen(input.value.trim());
    });
  }
});

searchAndShowTen("");
// more items were planned but errors made nine more feasible 

};

