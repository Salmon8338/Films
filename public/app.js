const moviesGrid = document.getElementById('moviesGrid');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const colorSelect = document.getElementById('colorSelect');
const autoplayCheckbox = document.getElementById('autoplay');
const playerModal = document.getElementById('playerModal');
const closeModal = document.getElementById('closeModal');
const vidkingIframe = document.getElementById('vidkingIframe');
const playerTitle = document.getElementById('playerTitle');

async function loadPopular(){
  loader.style.display = 'block';
  const resp = await fetch('/api/popular');
  const data = await resp.json();
  renderMovies(data.results || []);
  loader.style.display = 'none';
}

async function searchMovie(query){
  loader.style.display = 'block';
  const resp = await fetch('/api/search?q=' + encodeURIComponent(query));
  const data = await resp.json();
  renderMovies(data.results || []);
  loader.style.display = 'none';
}

function renderMovies(movies){
  moviesGrid.innerHTML = '';
  const tpl = document.getElementById('movieCard');
  movies.forEach(m => {
    const el = tpl.content.cloneNode(true);
    const img = el.querySelector('.poster');
    const title = el.querySelector('.title');
    const btn = el.querySelector('.playBtn');
    img.src = m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '';
    title.textContent = m.title;
    btn.addEventListener('click', () => openPlayer(m));
    moviesGrid.appendChild(el);
  });
}

function openPlayer(movie){
  const color = colorSelect.value;
  const autoPlay = autoplayCheckbox.checked ? 'true' : 'false';
  const embedUrl = `https://www.vidking.net/embed/movie/${movie.id}?color=${encodeURIComponent(color)}&autoPlay=${autoPlay}`;
  vidkingIframe.src = embedUrl;
  playerTitle.textContent = movie.title;
  playerModal.setAttribute('aria-hidden','false');
}

closeModal.addEventListener('click', () => {
  playerModal.setAttribute('aria-hidden','true');
  vidkingIframe.src = '';
});

searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (q) searchMovie(q);
});

loadPopular();
