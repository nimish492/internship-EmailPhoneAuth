document.addEventListener('DOMContentLoaded', function () {
    initialEmail();
    initialPhone();
    initialLoginValidation();
});

function initialEmail() {

    const emailForm = document.getElementById('emailRegistrationForm');
    const verifyEmailButton = document.getElementById('verifyEmail');
    const emailSection = document.getElementById('emailSection');
    const emailVerificationSection = document.getElementById('emailVerificationSection');
    const emailOtpInputs = document.querySelectorAll('#emailVerificationSection input[id^="emailOtp"]');
    const continueToPhoneButton = document.getElementById('continueToPhone');
    const continueToLoginDetailsButton = document.getElementById('continueToLoginDetails');
    const sendCodeButton = document.getElementById('sendCode1');
    const emailInput = document.getElementById('email');
    const phoneSection = document.getElementById('phoneSection');
    const phoneVerificationSection = document.getElementById('phoneVerificationSection');
    const sendCodeButton2 = document.getElementById('sendCode2');
    const verifyPhoneButton = document.getElementById('verifyPhone');
    const phoneOtpInputs = document.querySelectorAll('#phoneVerificationSection input[id^="phoneOtp"]');
    const phoneInput = document.getElementById('phone');
    const loginDetailsSection = document.getElementById('loginDetailsSection');
    const phoneForm = document.getElementById('phoneRegistrationForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameFeedback = document.getElementById('username-feedback');
    const passwordFeedback = document.getElementById('password-feedback');
    const continueToLoginButton = document.getElementById('continueToLogin');
    const resendEmail = document.getElementById('resendEmailOtp');
    const resendPhone = document.getElementById('resendPhoneOtp')


    let enteredEmail = '';
    let emailVerified = false;
    let enteredPhone = '';
    let phoneVerified = false;



    continueToPhoneButton.style.display = 'none';
    continueToLoginDetailsButton.style.display = 'none';
    continueToLoginButton.style.display = 'none';

    sendCodeButton.addEventListener('click', function (event) {
        event.preventDefault();
        enteredEmail = emailInput.value.trim();

        fetch('/register-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: enteredEmail })
        })
            .then(response => response.json())
            .then(data => {
                if (data.email) {
                    emailSection.style.display = 'none';
                    emailVerificationSection.style.display = 'block';
                    emailInput.disabled = true;
                    continueToPhoneButton.style.display = 'none';
                    continueToLoginDetailsButton.style.display = 'none';
                    continueToLoginButton.style.display = 'none';
                } else {
                    alert('Error sending verification code. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    verifyEmailButton.addEventListener('click', function () {
        const otpValue = Array.from(emailOtpInputs).map(input => input.value).join('');

        fetch('/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: enteredEmail, emailToken: otpValue })
        })
            .then(response => response.text())
            .then(message => {
                if (message === 'Email verified successfully.') {
                    emailSection.style.display = 'block';
                    emailVerificationSection.style.display = 'none';
                    sendCodeButton.style.display = 'none';

                    const verifiedText = document.createElement('div');
                    verifiedText.style.display = 'flex';
                    verifiedText.style.alignItems = 'center';
                    verifiedText.style.marginLeft = '20px';
                    verifiedText.style.color = 'green';
                    verifiedText.style.paddingBottom = '38px';
                    verifiedText.innerHTML = '&#10004; Verified';
                    sendCodeButton.parentElement.appendChild(verifiedText);

                    emailInput.value = enteredEmail;
                    emailInput.disabled = true;
                    emailVerified = true;
                    continueToPhoneButton.style.display = 'block';
                    continueToLoginDetailsButton.style.display = 'none';
                    continueToLoginButton.style.display = 'none';
                } else {
                    alert('Incorrect OTP. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    emailOtpInputs.forEach((input, index, inputs) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    resendEmailOtp.addEventListener('click', function () {
        // Disable the button
        resendEmailOtp.disabled = true;

        // Set the countdown duration (1 minute = 60 seconds)
        let countdownDuration = 60;

        // Display the countdown
        let countdownDisplay = document.getElementById('countdownDisplay');
        countdownDisplay.innerText = `Please wait ${countdownDuration} seconds to resend OTP`;

        // Update the countdown every second
        let countdownInterval = setInterval(function () {
            countdownDuration--;
            countdownDisplay.innerText = `Please wait ${countdownDuration} seconds to resend OTP`;

            // Check if the countdown is complete
            if (countdownDuration <= 0) {
                clearInterval(countdownInterval);
                countdownDisplay.innerText = ''; // Clear the countdown display
                resendEmailOtp.disabled = false; // Re-enable the button
            }
        }, 1000);

        // Send the OTP resend request
        fetch('/resend-email-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: enteredEmail })
        })
            .then(response => response.json())
            .then(data => {
                if (data.email) {
                    emailSection.style.display = 'none';
                    emailVerificationSection.style.display = 'block';
                    emailInput.disabled = true;
                    continueToPhoneButton.style.display = 'none';
                    continueToLoginDetailsButton.style.display = 'none';
                    continueToLoginButton.style.display = 'none';
                } else {
                    alert('Error sending verification code. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    continueToPhoneButton.addEventListener('click', function () {
        if (sendCodeButton.style.display !== 'none') {
            alert('Verify your Email first');
        } else {
            emailSection.style.display = 'none';
            phoneSection.style.display = 'block';
            continueToPhoneButton.style.display = 'none';
            continueToLoginDetailsButton.style.display = 'none';
            continueToLoginButton.style.display = 'none';

        }
    });
}


function initialPhone() {

    const emailForm = document.getElementById('emailRegistrationForm');
    const verifyEmailButton = document.getElementById('verifyEmail');
    const emailSection = document.getElementById('emailSection');
    const emailVerificationSection = document.getElementById('emailVerificationSection');
    const emailOtpInputs = document.querySelectorAll('#emailVerificationSection input[id^="emailOtp"]');
    const continueToPhoneButton = document.getElementById('continueToPhone');
    const continueToLoginDetailsButton = document.getElementById('continueToLoginDetails');
    const sendCodeButton = document.getElementById('sendCode1');
    const emailInput = document.getElementById('email');
    const phoneSection = document.getElementById('phoneSection');
    const phoneVerificationSection = document.getElementById('phoneVerificationSection');
    const sendCodeButton2 = document.getElementById('sendCode2');
    const verifyPhoneButton = document.getElementById('verifyPhone');
    const phoneOtpInputs = document.querySelectorAll('#phoneVerificationSection input[id^="phoneOtp"]');
    const phoneInput = document.getElementById('phone');
    const loginDetailsSection = document.getElementById('loginDetailsSection');
    const phoneForm = document.getElementById('phoneRegistrationForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameFeedback = document.getElementById('username-feedback');
    const passwordFeedback = document.getElementById('password-feedback');
    const continueToLoginButton = document.getElementById('continueToLogin');
    const resendEmail = document.getElementById('resendEmailOtp');
    const resendPhone = document.getElementById('resendPhoneOtp')

    let enteredEmail = '';
    let emailVerified = false;
    let enteredPhone = '';
    let phoneVerified = false;


    continueToPhoneButton.style.display = 'none';
    continueToLoginDetailsButton.style.display = 'none';




    sendCodeButton2.addEventListener('click', function (event) {
        event.preventDefault();
        enteredPhone = "+91" + phoneInput.value.trim(); // Format phone number with +91
        enteredEmail = emailInput.value.trim();

        fetch('/register-phone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: enteredPhone, email: enteredEmail })
        })
            .then(response => response.json())
            .then(data => {
                if (data.phone) {
                    phoneSection.style.display = 'none';
                    phoneVerificationSection.style.display = 'block';
                    phoneInput.disabled = true;
                    continueToPhoneButton.style.display = 'none';
                    continueToLoginDetailsButton.style.display = 'none';
                    continueToLoginButton.style.display = 'none';
                } else {
                    alert('Error sending verification code. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    verifyPhoneButton.addEventListener('click', function () {
        const otpValue = Array.from(phoneOtpInputs).map(input => input.value).join('');

        fetch('/verify-phone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneToken: otpValue })
        })
            .then(response => response.text())
            .then(message => {
                if (message === 'Phone verified successfully.') {
                    phoneSection.style.display = 'block';
                    phoneVerificationSection.style.display = 'none';
                    sendCodeButton2.style.display = 'none';

                    const verifiedText = document.createElement('div');
                    verifiedText.style.display = 'flex';
                    verifiedText.style.alignItems = 'center';
                    verifiedText.style.marginLeft = '20px';
                    verifiedText.style.color = 'green';
                    verifiedText.style.paddingBottom = '38px';
                    verifiedText.innerHTML = '&#10004; Verified';
                    sendCodeButton2.parentElement.appendChild(verifiedText);

                    phoneInput.value = phoneInput.value; // Update input field with entered phone number
                    phoneInput.disabled = true;
                    phoneVerified = true;
                    continueToPhoneButton.style.display = 'none';
                    continueToLoginDetailsButton.style.display = 'block';
                    continueToLoginButton.style.display = 'none';
                } else {
                    alert('Incorrect OTP. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    phoneOtpInputs.forEach((input, index, inputs) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });


    resendPhoneOtp.addEventListener('click', function () {
        // Disable the button
        resendPhoneOtp.disabled = true;

        // Set the countdown duration (1 minute = 60 seconds)
        let countdownDuration = 60;

        // Display the countdown
        let countdownDisplay = document.getElementById('countdownDisplay');
        countdownDisplay.innerText = `Please wait ${countdownDuration} seconds to resend OTP`;

        // Update the countdown every second
        let countdownInterval = setInterval(function () {
            countdownDuration--;
            countdownDisplay.innerText = `Please wait ${countdownDuration} seconds to resend OTP`;

            // Check if the countdown is complete
            if (countdownDuration <= 0) {
                clearInterval(countdownInterval);
                countdownDisplay.innerText = ''; // Clear the countdown display
                resendPhoneOtp.disabled = false; // Re-enable the button
            }
        }, 1000);


        // Send the OTP resend request
        fetch('/resend-phone-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: enteredPhone })
        })
            .then(response => response.json())
            .then(data => {
                if (data.phone) {
                    phoneSection.style.display = 'none';
                    phoneVerificationSection.style.display = 'block';
                    phoneInput.disabled = true;
                    continueToPhoneButton.style.display = 'none';
                    continueToLoginDetailsButton.style.display = 'none';
                    continueToLoginButton.style.display = 'none';
                } else {
                    alert('Error sending verification code. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));

    });


    continueToLoginDetailsButton.addEventListener('click', function () {
        if (sendCodeButton2.style.display !== 'none') {
            alert('Verify your phone first');
        } else {
            phoneSection.style.display = 'none';
            loginDetailsSection.style.display = 'block';
            continueToPhoneButton.style.display = 'none';
            continueToLoginDetailsButton.style.display = 'none';
            continueToLoginButton.style.display = 'block';

        }
    });
}

function initialLoginValidation() {
    const continueToLoginButton = document.getElementById('continueToLogin');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email'); // Assuming this is accessible
    const phoneInput = document.getElementById('phone'); // Assuming this is accessible
    const passwordMatchMessage = document.getElementById('password-match-message');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Initial text for conditions
    const initialText1 = 'Must not contain any special characters or spaces.';
    const initialText2 = 'Must be between 8 and 20 characters long.';
    const initialText3 = 'Must be at least 8 characters long.';
    const initialText4 = 'Contain at least 1 number and 1 UPPER case letter.';
    const initialText5 = 'Not contain sequences or repeated characters such as 1234, 3333, ZZZZ, etc.';

    // Add an event listener for input change
    usernameInput.addEventListener('input', function () {
        const username = usernameInput.value.trim(); // Get the trimmed value of username

        // Validation conditions
        const containsSpecialCharsOrSpaces = /[^\w]/.test(username); // Must not contain any special characters or spaces
        const isLengthValid = username.length >= 8 && username.length <= 20; // Must be 8 to 20 characters long

        // Select the small elements for the condition messages
        const conditionElement1 = document.querySelector('small:nth-of-type(1)');
        const conditionElement2 = document.querySelector('small:nth-of-type(2)');

        // Select the parent element of the input for border color change
        const parentElement = usernameInput.parentElement;

        // Check if input is empty
        if (username === '') {
            parentElement.style.borderColor = ''; // Reset border color
            // Display initial text
            conditionElement1.innerHTML = initialText1;
            conditionElement2.innerHTML = initialText2;
            return;
        }

        // Check validation conditions
        if (containsSpecialCharsOrSpaces) {
            // Display red cross and set border color to red for condition 1
            conditionElement1.innerHTML = '<span id="cross">❌ Must not contain any special characters or spaces.</span>';
            parentElement.style.borderColor = 'red';
        } else {
            // Display green tick and set border color to green for condition 1
            conditionElement1.innerHTML = '<span id="tick">✔ Must not contain any special characters or spaces.</span>';
            parentElement.style.borderColor = 'green';
        }

        if (!isLengthValid) {
            // Display red cross and set border color to red for condition 2
            conditionElement2.innerHTML = '<span id="cross">❌ Must be between 8 and 20 characters long.</span>';
            parentElement.style.borderColor = 'red';
        } else {
            // Display green tick and set border color to green for condition 2
            conditionElement2.innerHTML = '<span id="tick">✔ Must be between 8 and 20 characters long.</span>';
            parentElement.style.borderColor = 'green';
        }
    });

    // Add an event listener for input change
    passwordInput.addEventListener('input', function () {
        const password = passwordInput.value.trim(); // Get the trimmed value of password

        // Validation conditions
        const isLengthValid = password.length >= 8; // Must be at least 8 characters long
        const containsNumberAndUpperCase = /(?=.*\d)(?=.*[A-Z])/.test(password); // Must contain at least one number and one uppercase letter
        const containsNoRepeatedCharacters = !/(.)\1{3,}|(0123|1234|2345|3456|4567|5678|6789|7890|0987|9876|8765|7654|6543|5432|4321|3210|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|zyxw|yxwv|xwvu|wvut|vuts|utsr|tsrq|srqp|rqpo|qpon|ponm|onml|nmlk|mlkj|lkji|kji|jihg|ihgf|hgfe|gfed|fedc|edcb|dcba|dcbb|ccba|bbab|baba|aa)/.test(password); // Should not contain sequences or repeated characters

        // Select the small elements for the condition messages
        const conditionElements = passwordInput.parentElement.querySelectorAll('small');
        const conditionElement3 = conditionElements[0];
        const conditionElement4 = conditionElements[1];
        const conditionElement5 = conditionElements[2];

        // Select the parent element of the input for border color change
        const parentElement = passwordInput.parentElement;

        // Check if input is empty
        if (password === '') {
            parentElement.style.borderColor = ''; // Reset border color
            // Display initial text
            conditionElement3.innerHTML = initialText3;
            conditionElement4.innerHTML = initialText4;
            conditionElement5.innerHTML = initialText5;
            return;
        }

        // Reset border color initially
        let borderColor = 'green';

        // Check validation conditions and update messages
        if (isLengthValid) {
            // Display green tick for condition 1
            conditionElement3.innerHTML = '<span id="tick">✔ Must be at least 8 characters long.</span>';
        } else {
            // Display red cross for condition 1
            conditionElement3.innerHTML = '<span id="cross">❌ Must be at least 8 characters long.</span>';
            borderColor = 'red';
        }

        if (containsNumberAndUpperCase) {
            // Display green tick for condition 2
            conditionElement4.innerHTML = '<span id="tick">✔ Contain at least 1 number and 1 UPPER case letter.</span>';
        } else {
            // Display red cross for condition 2
            conditionElement4.innerHTML = '<span id="cross">❌ Contain at least 1 number and 1 UPPER case letter.</span>';
            borderColor = 'red';
        }

        if (containsNoRepeatedCharacters) {
            // Display green tick for condition 3
            conditionElement5.innerHTML = '<span id="tick">✔ Not contain sequences or repeated characters such as 1234, 3333, ZZZZ, etc.</span>';
        } else {
            // Display red cross for condition 3
            conditionElement5.innerHTML = '<span id="cross">❌ Not contain sequences or repeated characters such as 1234, 3333, ZZZZ, etc.</span>';
            borderColor = 'red';
        }

        // Set the border color of the parent element
        parentElement.style.borderColor = borderColor;
    });

    const togglePasswordButton = document.getElementById('togglePassword');
    togglePasswordButton.addEventListener('click', function () {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordButton.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    confirmPasswordInput.addEventListener('input', function () {
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (password === confirmPassword) {
            passwordMatchMessage.textContent = 'Passwords match.';
            passwordMatchMessage.style.color = 'green';
        } else {
            passwordMatchMessage.textContent = 'Passwords do not match.';
            passwordMatchMessage.style.color = 'red';
        }
    });

    continueToLoginButton.addEventListener('click', function () {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const enteredEmail = emailInput.value.trim(); // Ensure you have access to enteredEmail here
        const enteredPhone = phoneInput.value.trim(); // Ensure you have access to enteredPhone here

        const errors = [];

        // Check username validation
        if (document.querySelector('small:nth-of-type(1) span#cross')) {
            errors.push("Username must not contain any special characters or spaces.");
        }
        if (document.querySelector('small:nth-of-type(2) span#cross')) {
            errors.push("Username must be between 8 and 20 characters long.");
        }

        // Check password validation
        const conditionElements = passwordInput.parentElement.querySelectorAll('small');
        if (conditionElements[0].querySelector('span#cross')) {
            errors.push("Password must be at least 8 characters long.");
        }
        if (conditionElements[1].querySelector('span#cross')) {
            errors.push("Password must contain at least 1 number and 1 UPPER case letter.");
        }
        if (conditionElements[2].querySelector('span#cross')) {
            errors.push("Password must not contain sequences or repeated characters such as 1234, 3333, ZZZZ, etc.");
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            errors.unshift('Password and Confirm Password do not match.'); // Give priority to this error message
        }

        // Display all validation messages if any
        if (errors.length > 0) {
            alert('Validation Errors:\n' + errors.map(error => `• ${error}`).join('\n'));
            return;
        }

        fetch('/set-login-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email: enteredEmail, phone: enteredPhone })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Login details set successfully') {
                    alert('Login details set successfully');
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error setting login details. Please try again.');
            });
    });
}
