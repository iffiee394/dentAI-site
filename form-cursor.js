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

  function formToPayload(form) {
    var payload = {};
    new FormData(form).forEach(function (value, key) {
      if (key !== '_honey') {
        payload[key] = value;
      }
    });

    payload._subject = 'New DentAI Demo Request';
    payload._template = 'table';
    payload._captcha = 'false';
    payload._replyto = payload.email || '';
    return payload;
  }

  function getSubmitEmail() {
    var config = window.DentAI || {};
    return config.formSubmitEmail || config.contactEmail || 'aafaan72@gmail.com';
  }

  function submitWithJson(form) {
    var email = getSubmitEmail();
    return fetch('https://formsubmit.co/ajax/' + encodeURIComponent(email), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formToPayload(form))
    }).then(function (res) {
      return res.json().then(function (data) {
        if (res.ok && (data.success === true || data.success === 'true')) {
          return data;
        }
        throw new Error(data.message || 'Submission failed');
      });
    });
  }

  function submitWithFormEncoded(form) {
    var email = getSubmitEmail();
    var body = new URLSearchParams(formToPayload(form)).toString();
    return fetch('https://formsubmit.co/ajax/' + encodeURIComponent(email), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body
    }).then(function (res) {
      return res.json().then(function (data) {
        if (res.ok && (data.success === true || data.success === 'true')) {
          return data;
        }
        throw new Error(data.message || 'Submission failed');
      });
    });
  }

  function submitForm(form) {
    return submitWithJson(form).catch(function () {
      return submitWithFormEncoded(form);
    });
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
    var inbox = getSubmitEmail();

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
        .catch(function (err) {
          var msg = (err && err.message) ? err.message : 'Could not send right now.';
          showError(
            msg + ' Try again in a moment. First time setup? Check ' + inbox +
            ' for a FormSubmit activation email and click the link, then submit again.'
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
