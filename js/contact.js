// A two-step message form. The input values stay in place when moving back.
const messageForm = document.getElementById('message-form');

if (messageForm) {
  const steps = messageForm.querySelectorAll('.form-step');
  const result = document.getElementById('message-result');

  function showStep(number) {
    steps.forEach(function (step, index) {
      step.hidden = index !== number;
    });
  }

  function checkStep(step) {
    const invalid = step.querySelector(':invalid');
    return !invalid || invalid.reportValidity();
  }

  document.getElementById('message-next').addEventListener('click', function () {
    if (checkStep(steps[0])) {
      result.textContent = '';
      showStep(1);
    }
  });

  document.getElementById('message-back').addEventListener('click', function () {
    showStep(0);
  });

  $(messageForm).on('submit', function (event) {
    event.preventDefault();
    const $submit = $(this).find('[type="submit"]');
    if ($submit.prop('disabled')) return;
    if (steps[1].hidden) {
      $('#message-next').trigger('click');
      return;
    }
    if (!checkStep(steps[1])) return;

    const $form = $(this).attr('aria-busy', 'true');
    const $controls = $form.find(':input:enabled').prop('disabled', true);
    $submit.find('.submit-label').text('Please wait…');
    result.textContent = '';
    setTimeout(function () {
      $controls.prop('disabled', false);
      $submit.find('.submit-label').text('Submit');
      $form.attr('aria-busy', 'false');
      result.textContent = 'Form completed! This demo does not send messages.';
      $('#race-toast').stop(true, true).fadeIn(150).delay(2500).fadeOut(300);
    }, 1400);
  });
}
