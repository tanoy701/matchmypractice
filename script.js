(function () {
  var form = document.getElementById('lead-form');
  var errorBox = document.getElementById('form-error');
  var success = document.getElementById('form-success');
  var btn = document.getElementById('submit-btn');
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if (!form) return;

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorBox.hidden = true;

    var fields = form.querySelectorAll('#name, #email, #practice');
    var bad = false;
    fields.forEach(function (f) {
      var ok = f.value.trim() !== '' && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      f.classList.toggle('invalid', !ok);
      if (!ok) bad = true;
    });
    if (bad) {
      showError('Please fill in your name, a valid email and your practice type.');
      return;
    }

    var key = form.querySelector('[name=access_key]').value;
    if (key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      showError('Form is not live yet: add your Web3Forms access key in index.html.');
      return;
    }

    btn.disabled = true;
    var original = btn.textContent;
    btn.textContent = 'Sending...';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) { return res.json().then(function (d) { return { ok: res.ok && d.success, d: d }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error((r.d && r.d.message) || 'Submission failed');
        form.hidden = true;
        form.previousElementSibling && (form.previousElementSibling.hidden = true);
        success.hidden = false;
      })
      .catch(function () {
        showError('Something went wrong. Please try again in a moment.');
        btn.disabled = false;
        btn.textContent = original;
      });
  });
})();
