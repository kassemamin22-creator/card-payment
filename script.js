function switchMethod(method) {
    document.querySelectorAll('.payment-selector .selector-card').forEach(card => card.classList.remove('active'));
    event.currentTarget.classList.add('active');

    document.getElementById('card-preview-zone').classList.add('hidden');
    document.getElementById('credit-card-inputs').classList.add('hidden');
    document.getElementById('paypal-inputs').classList.add('hidden');
    document.getElementById('apple-inputs').classList.add('hidden');

    if (method === 'card') {
        document.getElementById('card-preview-zone').classList.remove('hidden');
        document.getElementById('credit-card-inputs').classList.remove('hidden');
    } else if (method === 'paypal') {
        document.getElementById('paypal-inputs').classList.remove('hidden');
    } else if (method === 'apple') {
        document.getElementById('apple-inputs').classList.remove('hidden');
    }
}

document.getElementById('card-name').addEventListener('input', function (e) {
    document.getElementById('mirror-card-holder').textContent = e.target.value.toUpperCase() || "AMIN KASSEM";
});

document.getElementById('card-number').addEventListener('input', function (e) {
    let value = e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
    e.target.value = value;
    document.getElementById('mirror-card-num').textContent = value || "4532 7182 9304 6511";

    const displayLogo = document.getElementById('card-type-display');
    if (value.startsWith('4')) {
        displayLogo.textContent = 'VISA';
    } else if (value.startsWith('5')) {
        displayLogo.textContent = 'MASTERCARD';
    } else {
        displayLogo.textContent = 'CARD';
    }
});

document.getElementById('card-expiry').addEventListener('input', function (e) {
    let raw = e.target.value.replace(/[^\d]/g, '');
    if (raw.length >= 2) {
        e.target.value = raw.substring(0, 2) + '/' + raw.substring(2, 4);
    } else {
        e.target.value = raw;
    }
    document.getElementById('mirror-card-expiry').textContent = e.target.value || "MM/YY";
});

function runGlobalValidation() {
    let passed = true;
    const paymentMethod = document.querySelector('.payment-selector .selector-card.active input').value;

    const baseInputs = document.querySelectorAll('#global-checkout-form input[required]');
    baseInputs.forEach(input => {
        const errorField = document.getElementById(`c-${input.id.split('-')[1]}-error`);
        if (!input.value.trim()) {
            input.classList.add('invalid');
            if (errorField) errorField.textContent = "Required field.";
            passed = false;
        } else if (input.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) {
            input.classList.add('invalid');
            if (errorField) errorField.textContent = "Format invalid.";
            passed = false;
        } else {
            input.classList.remove('invalid');
            if (errorField) errorField.textContent = "";
        }
    });

    if (paymentMethod === 'card') {
        const cardInputs = document.querySelectorAll('#credit-card-inputs input');
        cardInputs.forEach(input => {
            const errorField = document.getElementById(`${input.id}-error`);
            if (!input.value.trim()) {
                input.classList.add('invalid');
                if (errorField) errorField.textContent = "Required.";
                passed = false;
            } else if (input.id === 'card-number' && input.value.replace(/\s/g, '').length < 16) {
                input.classList.add('invalid');
                if (errorField) errorField.textContent = "Must be 16 digits.";
                passed = false;
            } else {
                input.classList.remove('invalid');
                if (errorField) errorField.textContent = "";
            }
        });
    }

    if (paymentMethod === 'paypal') {
        const paypalInputs = document.querySelectorAll('#paypal-inputs input');
        paypalInputs.forEach(input => {
            const errorField = document.getElementById(`${input.id}-error`);
            if (!input.value.trim()) {
                input.classList.add('invalid');
                if (errorField) errorField.textContent = "Required.";
                passed = false;
            } else {
                input.classList.remove('invalid');
                if (errorField) errorField.textContent = "";
            }
        });
    }

    if (paymentMethod === 'apple') {
        const appleInputs = document.querySelectorAll('#apple-inputs input');
        appleInputs.forEach(input => {
            const errorField = document.getElementById(`${input.id}-error`);
            if (!input.value.trim()) {
                input.classList.add('invalid');
                if (errorField) errorField.textContent = "Required.";
                passed = false;
            } else {
                input.classList.remove('invalid');
                if (errorField) errorField.textContent = "";
            }
        });
    }

    return passed;
}

document.getElementById('global-checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!runGlobalValidation()) return;

    const btn = document.getElementById('pay-button');
    const txt = document.getElementById('pay-button-text');
    const spinner = document.getElementById('spinner');

    btn.disabled = true;
    txt.classList.add('hidden');
    spinner.classList.remove('hidden');

    setTimeout(() => {
        btn.disabled = false;
        txt.classList.remove('hidden');
        spinner.classList.add('hidden');

        document.getElementById('result-overlay').classList.remove('hidden');
    }, 2500);
});

function dismissOverlay() {
    document.getElementById('result-overlay').classList.add('hidden');
    document.getElementById('global-checkout-form').reset();
    document.getElementById('mirror-card-holder').textContent = "AMIN KASSEM";
    document.getElementById('mirror-card-num').textContent = "4532 7182 9304 6511";
    document.getElementById('mirror-card-expiry').textContent = "MM/YY";
    switchMethod('card');
}