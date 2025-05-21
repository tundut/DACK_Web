document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ten_dang_nhap: username, 
                mat_khau: password 
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            }
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        })
        .catch(err => console.error(err));
    });
});