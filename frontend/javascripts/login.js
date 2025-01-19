const apiUrl = 'http://localhost:5000/api/users/login'; // Replace with your backend URL

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store JWT token
            alert('Login successful! Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        alert('Something went wrong. Please try again later.');
        console.error(err);
    }
});
