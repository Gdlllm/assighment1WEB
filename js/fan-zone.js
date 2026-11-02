// Interactive features on the Fan zone page.

const sessions = [
  {
    day: 'Friday',
    name: 'Practice',
    detail: 'Drivers learn the track and teams test their cars.',
    getSummary: function () { return this.day + ': ' + this.detail; }
  },
  {
    day: 'Saturday',
    name: 'Qualifying',
    detail: 'Drivers set their fastest lap to decide the starting grid.',
    getSummary: function () { return this.day + ': ' + this.detail; }
  },
  {
    day: 'Sunday',
    name: 'Race',
    detail: 'Drivers compete for points and the win.',
    getSummary: function () { return this.day + ': ' + this.detail; }
  }
];

const sessionList = document.getElementById('session-list');
const dayButtons = document.querySelectorAll('.session-button');

function showSessions(day) {
  let selectedDay;
  switch (day) {
    case 'friday': selectedDay = 'Friday'; break;
    case 'saturday': selectedDay = 'Saturday'; break;
    case 'sunday': selectedDay = 'Sunday'; break;
    default: selectedDay = 'All';
  }

  sessionList.textContent = '';
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    if (selectedDay === 'All' || session.day === selectedDay) {
      const column = document.createElement('div');
      column.className = 'col-md-4';

      const card = document.createElement('article');
      card.className = 'weekend-box p-3 h-100';

      const title = document.createElement('h3');
      title.className = 'h5';
      title.textContent = session.name;

      const text = document.createElement('p');
      text.className = 'mb-0';
      text.textContent = session.getSummary();

      card.appendChild(title);
      card.appendChild(text);
      column.appendChild(card);
      sessionList.appendChild(column);
    }
  }
}

if (sessionList) {
  showSessions('all');
  dayButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      showSessions(button.dataset.day);
      dayButtons.forEach(function (other) {
        const selected = other === button;
        other.classList.toggle('btn-danger', selected);
        other.classList.toggle('btn-outline-danger', !selected);
        other.setAttribute('aria-pressed', selected);
      });
    });
  });
}

const stars = document.querySelectorAll('.rating-star');
const ratingMessage = document.getElementById('rating-message');
stars.forEach(function (star, index) {
  star.addEventListener('click', function () {
    const rating = index + 1;
    stars.forEach(function (other, otherIndex) {
      const selected = otherIndex < rating;
      other.classList.toggle('selected', selected);
      other.setAttribute('aria-pressed', selected);
    });
    ratingMessage.textContent = 'Your rating: ' + rating + ' out of 5 stars.';
  });
});

const raceButton = document.getElementById('race-button');
if (raceButton) {
  const raceLights = document.getElementById('race-lights');
  const raceSound = document.getElementById('race-sound');
  const raceMessage = document.getElementById('race-message');

  raceButton.addEventListener('click', function () {
    raceButton.disabled = true;
    raceLights.classList.add('running');
    raceMessage.textContent = 'Lights out and away we go!';

    raceSound.pause();
    raceSound.currentTime = 0;
    raceSound.play().catch(function () {
      raceMessage.textContent = 'Lights out and away we go! Sound is unavailable.';
    });

    setTimeout(function () {
      raceLights.classList.remove('running');
      raceButton.disabled = false;
    }, 1300);
  });
}

const themeButton = document.getElementById('theme-button');
if (themeButton) {
  themeButton.addEventListener('click', function () {
    const night = document.body.classList.toggle('night-mode');
    document.body.style.backgroundColor = '';
    themeButton.textContent = night ? 'Day mode' : 'Night mode';
    themeButton.setAttribute('aria-pressed', night);
  });

  document.getElementById('color-button').addEventListener('click', function () {
    document.body.classList.remove('night-mode');
    themeButton.textContent = 'Night mode';
    themeButton.setAttribute('aria-pressed', 'false');
  });
}
