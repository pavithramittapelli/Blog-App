import { Link } from "react-router-dom";

import React, { useEffect, useContext } from 'react'
import { UserContext } from "./userContext";

function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch("http://127.0.0.1:4000/profile", {
            credentials: 'include'
        }).then(response =>
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            }));
    }, [])


    function logout() {
        fetch("http://127.0.0.1:4000/logout", {
            method: 'POST',
            credentials: 'include',
        })
        setUserInfo(null);
    }
    const username = userInfo?.username;
    return (
        <header>
            <Link to="/" className="logo">MyBlog</Link>
            <nav>
                {username ? (
                    <>
                        <Link to="/create">Create new post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header >
    )
}

export default Header
