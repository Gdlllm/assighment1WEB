// Shared interactions used across the site.

const signupForm = document.getElementById('signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const result = document.getElementById('signup-result');
    let valid = true;

    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('confirm-error').textContent = '';
    result.textContent = '';

    if (name === '') {
      document.getElementById('name-error').textContent = 'Please enter your name.';
      valid = false;
    }
    if (email === '') {
      document.getElementById('email-error').textContent = 'Please enter your email.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('email-error').textContent = 'Please enter a valid email address.';
      valid = false;
    }
    if (password.length < 8) {
      document.getElementById('password-error').textContent = 'Password must have at least 8 characters.';
      valid = false;
    }
    if (confirm === '') {
      document.getElementById('confirm-error').textContent = 'Please confirm your password.';
      valid = false;
    } else if (confirm !== password) {
      document.getElementById('confirm-error').textContent = 'Passwords do not match.';
      valid = false;
    }

    if (valid) {
      result.textContent = 'Form is valid!';
      result.style.color = 'green';
    } else {
      result.textContent = 'Please fix the errors above.';
      result.style.color = '#b00020';
    }
  });
}

document.querySelectorAll('.faq-question').forEach(function (button) {
  const answer = button.nextElementSibling;
  let hideTimer;

  button.addEventListener('click', function () {
    clearTimeout(hideTimer);
    if (button.getAttribute('aria-expanded') === 'true') {
      button.setAttribute('aria-expanded', 'false');
      answer.classList.remove('open');
      hideTimer = setTimeout(function () { answer.hidden = true; }, 300);
    } else {
      answer.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { answer.classList.add('open'); });
    }
  });
});

const popup = document.getElementById('subscribe-popup');
const openButton = document.getElementById('subscribe-button');
if (popup && openButton) {
  const closeButton = document.getElementById('close-popup');
  openButton.addEventListener('click', function () {
    popup.hidden = false;
    document.getElementById('subscribe-email').focus();
  });
  closeButton.addEventListener('click', function () {
    popup.hidden = true;
    openButton.focus();
  });
  popup.addEventListener('click', function (event) {
    if (event.target === popup) {
      popup.hidden = true;
      openButton.focus();
    }
  });
  document.getElementById('subscribe-form').addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('subscribe-result').textContent = 'Thank you for subscribing!';
  });
}

const colorButton = document.getElementById('color-button');
if (colorButton) {
  const colors = ['#f2f2f2', '#fff1f1', '#eef5ff', '#f0fff0'];
  let colorNumber = 0;
  colorButton.addEventListener('click', function () {
    colorNumber = (colorNumber + 1) % colors.length;
    document.body.style.backgroundColor = colors[colorNumber];
  });
}

const currentTime = document.getElementById('current-time');
if (currentTime) {
  function showTime() {
    currentTime.textContent = new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', second: '2-digit'
    });
  }
  showTime();
  setInterval(showTime, 1000);
}

// Use left and right arrow keys to move through the main navigation.
document.querySelectorAll('.main-nav').forEach(function (nav) {
  const links = Array.from(nav.querySelectorAll('a'));

  nav.addEventListener('keydown', function (event) {
    const currentIndex = links.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % links.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + links.length) % links.length;
        break;
      default:
        return;
    }

    event.preventDefault();
    links[nextIndex].focus();
  });
});
