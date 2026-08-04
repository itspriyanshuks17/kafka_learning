// Client-side real-time search
(function(){
  function getBase() {
    return location.pathname.includes('/modules/') ? '../' : '';
  }

  function createSearchUI() {
    const brand = document.querySelector('.rail-brand');
    if (!brand) return;
    const container = document.createElement('div');
    container.className = 'search-container';
    container.innerHTML = `
      <input aria-label="Search the site" class="search-input" placeholder="Search modules, topics..." />
      <div class="search-results" aria-live="polite"></div>
    `;
    brand.appendChild(container);
    return container;
  }

  function highlight(text, q) {
    if (!q) return text;
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')','ig');
    return text.replace(re, '<mark>$1</mark>');
  }

  function renderResults(container, hits, base) {
    const results = container.querySelector('.search-results');
    if (!results) return;
    if (!hits || hits.length === 0) {
      results.innerHTML = '<div class="no-results">No results</div>';
      return;
    }
    results.innerHTML = hits.map(h => `
      <a class="search-hit" href="${base + h.path}">
        <div class="hit-title">${h.title}</div>
        <div class="hit-snippet">${h.snippet}</div>
      </a>
    `).join('');
  }

  function simpleSearch(index, q) {
    if (!q) return [];
    q = q.trim().toLowerCase();
    const hits = index.map(item => {
      const inTitle = item.title.toLowerCase().indexOf(q);
      const inSnippet = item.snippet.toLowerCase().indexOf(q);
      let score = -1;
      if (inTitle !== -1) score = 100 - inTitle; // earlier match -> higher
      if (inSnippet !== -1) score = Math.max(score, 50 - inSnippet);
      return { item, score };
    }).filter(h => h.score > -1).sort((a,b)=>b.score - a.score).map(h=>h.item);
    return hits.slice(0,10);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const base = getBase();
    const container = createSearchUI();
    if (!container) return;
    const input = container.querySelector('.search-input');
    const resultsEl = container.querySelector('.search-results');

    // Fetch the index from the repository raw URL to avoid relative-path issues
    fetch('https://raw.githubusercontent.com/itspriyanshuks17/kafka_learning/main/assets/search-index.json').then(r=>r.json()).then(index => {
      let timeout = null;
      input.addEventListener('input', (e)=>{
        clearTimeout(timeout);
        const q = e.target.value;
        timeout = setTimeout(()=>{
          if (!q) { renderResults(container, [], base); return; }
          const hits = simpleSearch(index, q).map(h=>({
            title: highlight(h.title, q),
            snippet: highlight(h.snippet, q),
            path: h.path
          }));
          renderResults(container, hits, base);
        }, 160);
      });

      // close results when clicking outside
      document.addEventListener('click', (ev)=>{
        if (!container.contains(ev.target)) {
          resultsEl.style.display = 'none';
        } else {
          resultsEl.style.display = '';
        }
      });
    }).catch(()=>{
      // ignore
    });
  });
})();
