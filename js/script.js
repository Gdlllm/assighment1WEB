$(document).ready(function () {
  console.log('jQuery is ready!');
  $('#driver-query').on('input', filterDrivers);
  $('#driver-suggestions').on('click', 'button', chooseDriver);
  $('.driver-search').on('keydown', navigateSuggestions).on('focusout', function (event) {
    if (!this.contains(event.relatedTarget)) $('#driver-suggestions').empty();
  });
  $('#copy-note').on('click', copyReminder);

  $(window).on('scroll resize', updateProgress);
  new ResizeObserver(updateProgress).observe(document.body);
  onFirstView('img[data-src]', photo => { photo.src = photo.dataset.src; });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $('[data-count]').text('0');
    onFirstView('[data-count]', animateCounter);
  }
});

// Tasks 1–3: filter the existing cards and suggest matching driver names.
function filterDrivers() {
  const query = $('#driver-query').val().trim().toLowerCase();
  const $list = $('#driver-suggestions').empty();
  let count = 0;
  $('.driver-card').each(function () {
    const $fields = $(this).find('.card-title, .card-text');
    const matches = $fields.toArray().some(field =>
      field.textContent.toLowerCase().includes(query)
    );
    this.hidden = !matches;
    if (!matches) return;

    count++;
    $fields.each(function () { highlightMatches(this, query); });
    if (query) {
      const name = $(this).find('.card-title').text();
      $('<button type="button" class="dropdown-item">').text(name).appendTo($list);
    }
  });
  $('#driver-count').text(count ? 'Profiles found: ' + count : 'No drivers found. Try a different name or team.');
}

function highlightMatches(field, query) {
  let text = field.textContent;
  field.replaceChildren();
  while (query) {
    const index = text.toLowerCase().indexOf(query);
    if (index < 0) break;
    field.append(text.slice(0, index));
    $('<mark>').text(text.slice(index, index + query.length)).appendTo(field);
    text = text.slice(index + query.length);
  }
  field.append(text);
}

function chooseDriver() {
  $('#driver-query').val(this.textContent).trigger('input').trigger('focus');
  $('#driver-suggestions').empty();
}

function navigateSuggestions(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    $('#driver-suggestions').empty();
    $('#driver-query').trigger('focus');
  }
  if (event.key === 'ArrowDown' && $('#driver-suggestions button').length) {
    event.preventDefault();
    const next = document.activeElement.nextElementSibling;
    const first = $('#driver-suggestions button')[0];
    (next?.matches('.dropdown-item') ? next : first).focus();
  }
}

// Task 4: scroll distance divided by the total scrollable height.
function updateProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = distance > 0 ? window.scrollY / distance : 0;
  $('#scroll-progress').css('transform', 'scaleX(' + fraction + ')');
}

// Tasks 5 and 9: start each counter or load each photo only once.
function onFirstView(selector, action) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      action(entry.target);
    }
  });
  document.querySelectorAll(selector).forEach(element => observer.observe(element));
}

function animateCounter(number) {
  $({ value: 0 }).animate({ value: Number(number.dataset.count) }, {
    duration: 1200,
    step(value) { number.textContent = Math.round(value); }
  });
}

// Task 8: show the checkmark only after copying succeeds.
let copyTimer;
async function copyReminder() {
  const note = document.getElementById('weekend-note');
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(note.textContent);
    } else {
      // Older browsers copy the selected text.
      const selection = window.getSelection();
      selection.selectAllChildren(note);
      if (!document.execCommand('copy')) throw new Error('Copy unavailable');
      selection.removeAllRanges();
    }
    $('#copy-note span').text('✓');
    $('#copy-tip').text('Copied to clipboard!');
  } catch {
    $('#copy-note span').text('⧉');
    $('#copy-tip').text('Select the reminder and copy it manually.');
  }
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    $('#copy-note span').text('⧉');
    $('#copy-tip').empty();
  }, 2400);
}
