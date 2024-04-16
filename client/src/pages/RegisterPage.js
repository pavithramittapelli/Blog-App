import React, { useState } from 'react'

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")
    async function register(e) {
        e.preventDefault();
        console.log("fetching register data")
        try {
            const response = await fetch("http://127.0.0.1:4000/register", {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                alert('Registration Failed!');
            }
            // Handle successful response here
        } catch (error) {
            console.log("error", e)
        }
    }
    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" placeholder='username' value={username}
                onChange={eve => setUsername(eve.target.value)} />
            <input type="password" placeholder='password' value={password}
                onChange={eve => setPassword(eve.target.value)} />
            <button>Register</button>
        </form>
    )
}
export default RegisterPage
