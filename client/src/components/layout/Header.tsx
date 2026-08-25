import { Link, useLocation } from 'react-router-dom'
import logo from '../../../public/favicon.svg'

export function Header() {
    const location = useLocation()
    return (
        <div className = "header">
            <div className = "header__brand">
                <img src = { logo } alt = "BookRoom" />
                <Link to = "/">
                    <h2>BookRoom</h2>
                </Link>
            </div>
            <div className = "header__nav">
                <Link to = "/rooms" className = {location.pathname === "/rooms" ? "active" : ""}>Переговорные</Link>
                <Link to = "/booking" className = {location.pathname === "/booking" ? "active" : ""}>Мои бронирования</Link>
            </div>
            <div className = "header__user">
                <div className = "header__user__name">
                    Тестовый
                </div>
                <div className = "header__user__avatar__wrapper">
                    <img src = { logo } alt = "Avatar" />
                </div>
            </div>
        </div>
    )
}   