$(document).ready(function () {
  console.log('jQuery is ready!');
  setupDriverSearch();
  setupProgress();
  setupCounters();
  setupCopyButton();
  setupGalleryLoading();
});

function setupDriverSearch() {
  const $input = $('#driver-query');
  if (!$input.length) return;
  const $suggestions = $('#driver-suggestions');
  const drivers = $('#driver-results .col').get().map(function (column) {
    const $title = $(column).find('.card-title');
    const $summary = $(column).find('.card-text');
    return { column, $title, $summary, name: $title.text(), summary: $summary.text() };
  });

  function highlight($element, original, query) {
    $element.empty();
    const lower = original.toLowerCase();
    let start = 0;
    let match = query ? lower.indexOf(query) : -1;
    while (match !== -1) {
      $element.append(document.createTextNode(original.slice(start, match)));
      $('<mark>').text(original.slice(match, match + query.length)).appendTo($element);
      start = match + query.length;
      match = lower.indexOf(query, start);
    }
    $element.append(document.createTextNode(original.slice(start)));
  }

  function render(showSuggestions) {
    const query = $input.val().trim().toLowerCase();
    let count = 0;
    $suggestions.empty();
    drivers.forEach(function (driver) {
      const matches = [driver.name, driver.summary].some(text => text.toLowerCase().includes(query));
      $(driver.column).prop('hidden', !matches);
      if (!matches) return;
      count++;
      highlight(driver.$title, driver.name, query);
      highlight(driver.$summary, driver.summary, query);
      if (showSuggestions && query) {
        $('<button type="button">').text(driver.name).appendTo($suggestions);
      }
    });
    $suggestions.prop('hidden', !$suggestions.children().length);
    $('#driver-count').text(count ? count + (count === 1 ? ' driver profile' : ' driver profiles') :
      'No drivers found. Try a different name or team.');
    $(window).trigger('resize');
  }

  $input.on('input', () => render(true));
  $suggestions.on('click', 'button', function () {
    $input.val($(this).text()).trigger('focus');
    render(false);
  });
  $('.driver-search').on('keydown', function (event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      $suggestions.prop('hidden', true);
      $input.trigger('focus');
    }
    if (event.key === 'ArrowDown' && !$suggestions.prop('hidden')) {
      event.preventDefault();
      const buttons = $suggestions.children().get();
      buttons[(buttons.indexOf(document.activeElement) + 1) % buttons.length].focus();
    }
  }).on('focusout', function (event) {
    if (!this.contains(event.relatedTarget)) $suggestions.prop('hidden', true);
  });
}

function setupProgress() {
  const $bar = $('#scroll-progress');
  function update() {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    $bar.css('transform', 'scaleX(' + fraction + ')');
  }
  $(window).on('scroll resize load', update);
  new ResizeObserver(update).observe(document.body);
  update();
}

function setupCounters() {
  const $numbers = $('[data-count]');
  if (!$numbers.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const $number = $(entry.target);
      $({ value: 0 }).animate({ value: Number($number.attr('data-count')) }, {
        duration: 1200,
        step: function (value) { $number.text(Math.round(value)); }
      });
    });
  });
  $numbers.text('0').each(function () { observer.observe(this); });
}

function setupCopyButton() {
  const $button = $('#copy-note');
  let timer;
  $button.on('click', async function () {
    const note = $('#weekend-note')[0];
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(note.textContent);
      } else {
        const range = document.createRange();
        range.selectNodeContents(note);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        const copied = document.execCommand('copy');
        if (!copied) throw new Error('Copy unavailable');
        selection.removeAllRanges();
      }
      $button.find('span').text('✓');
      $('#copy-tip').text('Copied to clipboard!');
    } catch {
      $('#copy-tip').text('Select the reminder and copy it manually.');
    }
    clearTimeout(timer);
    timer = setTimeout(function () {
      $button.find('span').text('⧉');
      $('#copy-tip').empty();
    }, 2400);
  });
}

function setupGalleryLoading() {
  const $photos = $('img[data-src]');
  if (!$photos.length) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const $photo = $(entry.target);
      $photo.attr('src', $photo.attr('data-src')).removeAttr('data-src');
      observer.unobserve(entry.target);
    });
  });
  $photos.each(function () { observer.observe(this); });
}
