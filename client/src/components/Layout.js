import Header from "./Header"
import { Outlet } from 'react-router-dom'
import React from 'react'

function Layout() {
    return (
        <div>
            <main>
                <Header></Header>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout

