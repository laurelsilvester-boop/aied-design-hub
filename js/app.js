let allTools = [];

async function loadTools() {
  try {
    const response = await fetch('data/tools.json');
    if (!response.ok) throw new Error('Could not load tools data.');
    const data = await response.json();
    allTools = data.tools;
    populateCategoryFilter();
    renderCards(allTools);
  } catch (error) {
    document.getElementById('no-results').textContent =
      'Could not load tools. If you are running this locally, open it with VS Code Live Server rather than opening the file directly.';
    document.getElementById('no-results').classList.remove('hidden');
  }
}

function populateCategoryFilter() {
  const categories = [...new Set(allTools.map(t => t.category))].sort();
  const select = document.getElementById('category-filter');
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function renderCards(tools) {
  const grid = document.getElementById('results-grid');
  const noResults = document.getElementById('no-results');
  const count = document.getElementById('results-count');

  grid.innerHTML = '';

  if (tools.length === 0) {
    noResults.textContent = 'No tools match your search. Try different keywords or remove a filter.';
    noResults.classList.remove('hidden');
    count.textContent = '';
    return;
  }

  noResults.classList.add('hidden');
  count.textContent = `Showing ${tools.length} tool${tools.length !== 1 ? 's' : ''}`;

  tools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.setAttribute('role', 'listitem');

    card.innerHTML = `
      <div class="card-header">
        <span class="tool-name">${escHtml(tool.name)}</span>
        <span class="category-badge">${escHtml(tool.category)}</span>
      </div>
      <p class="tool-description">${escHtml(tool.description)}</p>
      <div class="traffic-lights" aria-label="Safety ratings">
        ${trafficItem('Cost', tool.ratings.cost, tool.notes.cost)}
        ${trafficItem('Privacy', tool.ratings.privacy, tool.notes.privacy)}
        ${trafficItem('Guardrails', tool.ratings.guardrails, tool.notes.guardrails)}
        ${trafficItem('Accessibility', tool.ratings.accessibility, tool.notes.accessibility)}
      </div>
      <div class="card-footer">
        <a
          href="${escHtml(tool.url)}"
          target="_blank"
          rel="noopener noreferrer"
          class="visit-link"
          aria-label="Visit ${escHtml(tool.name)} (opens in new tab)"
        >Visit tool</a>
      </div>
    `;

    grid.appendChild(card);
  });
}

function trafficItem(label, rating, note) {
  const ratingLabels = { green: 'Good', amber: 'Caution', red: 'Concern' };
  const ariaLabel = `${label}: ${ratingLabels[rating] || rating}${note ? '. ' + note : ''}`;
  return `
    <div class="traffic-item" title="${escHtml(note || '')}" aria-label="${escHtml(ariaLabel)}">
      <span class="dot dot-${escHtml(rating)}" aria-hidden="true"></span>
      <span>${escHtml(label)}</span>
    </div>`;
}

function escHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function applyFilters() {
  const query      = document.getElementById('search').value.toLowerCase().trim();
  const category   = document.getElementById('category-filter').value;
  const cost       = document.getElementById('cost-filter').value;
  const privacy    = document.getElementById('privacy-filter').value;
  const guardrails = document.getElementById('guardrails-filter').value;

  const filtered = allTools.filter(tool => {
    const matchesQuery = !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query)));

    const matchesCategory   = !category   || tool.category === category;
    const matchesCost       = !cost       || tool.ratings.cost === cost;
    const matchesPrivacy    = !privacy    || tool.ratings.privacy === privacy;
    const matchesGuardrails = !guardrails || tool.ratings.guardrails === guardrails;

    return matchesQuery && matchesCategory && matchesCost && matchesPrivacy && matchesGuardrails;
  });

  renderCards(filtered);
}

document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('category-filter').addEventListener('change', applyFilters);
document.getElementById('cost-filter').addEventListener('change', applyFilters);
document.getElementById('privacy-filter').addEventListener('change', applyFilters);
document.getElementById('guardrails-filter').addEventListener('change', applyFilters);

loadTools();
