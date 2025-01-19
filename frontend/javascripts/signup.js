const apiUrl = 'https://reflecto-jnv1.onrender.com/api/users/signup'; // Replace with your backend URL

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            alert('Signup successful! Redirecting to login...');
            window.location.href = 'login.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        alert('Something went wrong. Please try again later.');
        console.error(err);
    }
});
