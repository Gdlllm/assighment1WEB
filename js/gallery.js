// Choose a small photo to show it in the large image area.
const featuredPhoto = document.getElementById('featured-photo');
const thumbnails = document.querySelectorAll('.gallery-thumb');

if (featuredPhoto) {
  thumbnails.forEach(function (button) {
    button.addEventListener('click', function () {
      featuredPhoto.src = button.dataset.image;
      featuredPhoto.alt = button.dataset.caption;
      document.getElementById('featured-caption').textContent = button.dataset.caption;

      thumbnails.forEach(function (other) {
        const selected = other === button;
        other.classList.toggle('selected', selected);
        other.setAttribute('aria-pressed', selected);
      });
    });
  });
}
