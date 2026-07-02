(function () {
  'use strict';

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (el) {
      el.classList.remove('error');
    });
  }

  function validateForm(form) {
    clearErrors(form);
    var valid = true;

    form.querySelectorAll('[required]').forEach(function (input) {
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      }
    });

    var emailInput = form.querySelector('[name="email"]');
    if (emailInput && emailInput.value.trim() && !validateEmail(emailInput.value.trim())) {
      emailInput.classList.add('error');
      valid = false;
    }

    return valid;
  }

  function encodeFormData(form) {
    var config = window.DentAI || {};
    var data = new FormData(form);
    data.set('form-name', config.formName || form.getAttribute('name') || 'demo-request');
    return new URLSearchParams(data).toString();
  }

  function getFormEndpoint(form) {
    var config = window.DentAI || {};
    return config.formPage || form.getAttribute('action') || '/book.html';
  }

  function submitForm(form) {
    return fetch(getFormEndpoint(form), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(form)
    }).then(function (res) {
      if (res.ok) return res;
      throw new Error('Submission failed (status ' + res.status + ')');
    });
  }

  function getContactEmail() {
    var config = window.DentAI || {};
    return config.contactEmail || 'iffi0274@gmail.com';
  }

  window.initDentAIForm = function (options) {
    options = options || {};
    var form = document.getElementById(options.formId || 'demoForm');
    if (!form) return;

    var formView = document.getElementById(options.formViewId || 'formView');
    var successView = document.getElementById(options.successViewId || 'successView');
    var errorView = document.getElementById(options.errorViewId || 'errorView');
    var submitBtn = document.getElementById(options.submitBtnId || 'submitBtn');
    var submitLabel = submitBtn ? submitBtn.textContent : 'Submit';
    var inbox = getContactEmail();

    function hideError() {
      if (errorView) errorView.classList.remove('show');
    }

    function showError(message) {
      if (errorView) {
        errorView.textContent = message;
        errorView.classList.add('show');
      }
    }

    function showSuccess() {
      hideError();
      if (formView) formView.style.display = 'none';
      if (successView) successView.classList.add('show');
    }

    function resetButton() {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideError();

      if (!validateForm(form)) {
        var firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      submitForm(form)
        .then(function () {
          showSuccess();
        })
        .catch(function () {
          showError(
            'Could not send right now. Try again in a moment, or email us at ' + inbox + '.'
          );
        })
        .finally(resetButton);
    });

    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        this.classList.remove('error');
        hideError();
      });
    });
  };
})();
