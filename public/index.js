const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const showMoreButton = document.getElementById('show-more-button');
const favoritesList = document.getElementById('favorites-list');
const searchSection = document.getElementById('search-section');
const favoritesSection = document.getElementById('favorites-section');
const searchLink = document.getElementById('search-link');
const favoritesLink = document.getElementById('favorites-link');
const authLinks = document.getElementById('auth-links');
const logoutLink = document.getElementById('logout-link');

let query = '';
let page = 1;

const token = localStorage.getItem('token');
if (token) {
  authLinks.style.display = 'none';
  logoutLink.style.display = 'inline';
} else {
  authLinks.style.display = 'inline';
  logoutLink.style.display = 'none';
}

logoutLink.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = '/login';
});

searchLink.addEventListener('click', (e) => {
  e.preventDefault();
  searchSection.style.display = 'block';
  favoritesSection.style.display = 'none';
});


favoritesLink.addEventListener('click', (e) => {
  e.preventDefault();
  searchSection.style.display = 'none';
  favoritesSection.style.display = 'block';
  displayFavorites();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!token) {
    alert('Please login to search images.');
    window.location.href = '/login';
    return;
  }
  query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a search query.');
    return;
  }
  page = 1;
  searchImages();
});

showMoreButton.addEventListener('click', () => {
  page++;
  searchImages();
});

async function searchImages() {
  try {
    const response = await fetch(`/api/images/search?page=${page}&query=${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (page === 1) searchResults.innerHTML = '';
    
    if (response.ok) {
      const favorites = await getFavorites();
      data.results.forEach(photo => {
        const isFavorited = favorites.some(img => img.id === photo.id);
        const result = document.createElement('div');
        result.classList.add('search-result');
        result.innerHTML = `
          <img src="${photo.urls.small}" alt="${photo.alt_description || 'Image'}" />
          <a href="${photo.links.html}" target="_blank">${photo.alt_description || 'View Image'}</a>
          <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                  data-image-id="${photo.id}" 
                  data-url="${photo.urls.small}" 
                  data-desc="${photo.alt_description || 'Image'}">❤️</button>
        `;
        searchResults.appendChild(result);
      });
      showMoreButton.style.display = data.results.length > 0 ? 'block' : 'none';
    } else {
      alert(data.message || 'Failed to load images');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load images. Please try again.');
  }
}

searchResults.addEventListener('click', async (e) => {
  if (e.target.classList.contains('favorite-btn')) {
    const button = e.target;
    const imageId = button.getAttribute('data-image-id');
    const imageUrl = button.getAttribute('data-url');
    const imageDesc = button.getAttribute('data-desc');
    await toggleFavorite(imageId, imageUrl, imageDesc, button);
  }
});

async function toggleFavorite(id, url, desc, button) {
  try {
    const method = button.classList.contains('favorited') ? 'DELETE' : 'POST';
    const response = await fetch('/api/favorites', {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, url, desc })
    });

    if (response.ok) {
      button.classList.toggle('favorited');
      button.innerHTML = button.classList.contains('favorited') ? '💙' : '❤️';
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to update favorite');
    }
  } catch (error) {
    alert('Error updating favorite');
  }
}


async function displayFavorites() {
  favoritesList.innerHTML = '';
  try {
    const favorites = await getFavorites();
    if (favorites.length === 0) {
      favoritesList.innerHTML = '<p>No favorite images yet.</p>';
    } else {
      favorites.forEach(img => {
        const div = document.createElement('div');
        div.classList.add('search-result');
        div.innerHTML = `
          <img src="${img.url}" alt="${img.desc}" />
          <p>${img.desc}</p>
          <button class="remove-favorite" data-image-id="${img.id}">Remove</button>
        `;
        favoritesList.appendChild(div);
      });
    }
  } catch (error) {
    favoritesList.innerHTML = '<p>Error loading favorites</p>';
  }
}

async function getFavorites() {
  const response = await fetch('/api/favorites', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.ok ? await response.json() : [];
}

favoritesList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('remove-favorite')) {
    const imageId = e.target.getAttribute('data-image-id');
    await fetch('/api/favorites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: imageId })
    });
    displayFavorites();
    updateFavoriteButtons();
  }
});

function updateFavoriteButtons() {
  getFavorites().then(favorites => {
    const favoriteBtns = searchResults.querySelectorAll('.favorite-btn');
    favoriteBtns.forEach(btn => {
      const imageId = btn.getAttribute('data-image-id');
      btn.classList.toggle('favorited', favorites.some(img => img.id === imageId));
    });
  });
}