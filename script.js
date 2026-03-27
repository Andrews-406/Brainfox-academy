// Brainfox Academy — Tournament Loader
// ✅ Reads data/tournaments.json (create a "data" folder inside TOURNAMENT-SITE)

async function loadTournaments() {
  try {
    const res = await fetch('data/tournaments.json');
    if (!res.ok) throw new Error('JSON not found');
    const data = await res.json();
    renderFeatured(data.featured);
    renderPastEvents(data.past_events);
  } catch (err) {
    console.error('Could not load tournament data:', err);
    document.getElementById('featured-title').textContent = 'Could not load data. Check console.';
  }
}

function renderFeatured(t) {
  document.getElementById('featured-poster').src = t.poster;
  document.getElementById('featured-poster').alt = t.title;
  document.getElementById('featured-title').textContent = t.title;
  document.getElementById('featured-date').textContent = '📅 ' + t.date;
  document.getElementById('featured-desc').textContent = t.description;
  document.getElementById('register-btn').href = t.registration_link;

  const card = document.getElementById('featured-card');
  card.classList.add('visible');
}

function renderPastEvents(events) {
  const grid = document.getElementById('past-grid');
  grid.innerHTML = '';

  if (!events || events.length === 0) {
    grid.innerHTML = '<p class="no-events">No past events yet. Check back after the first tournament wraps up!</p>';
    return;
  }

  events.forEach((e, i) => {
    const item = document.createElement('div');
    item.className = 'past-item';
    item.style.animationDelay = `${i * 80}ms`;
    item.innerHTML = `
      <div class="past-img-wrap">
        <img src="${e.poster}" alt="${e.title}" loading="lazy" />
        <div class="past-overlay"><span>${e.title}</span></div>
      </div>
      <p class="past-title">${e.title}</p>
      <p class="past-date">${e.date}</p>
    `;
    grid.appendChild(item);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.past-item').forEach(el => observer.observe(el));
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Sticky nav shadow
window.addEventListener('scroll', () => {
  document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 10);
});

document.addEventListener('DOMContentLoaded', loadTournaments);