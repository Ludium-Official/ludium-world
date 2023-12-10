import Link from "next/link";
import announcementnavigationstyle from "./announcement.module.css";

export default function ModuleNavigation({ links, children }) {
    return <nav className={announcementnavigationstyle["navigation-wrapper"]}>
        <ul className={announcementnavigationstyle["navigation-list"]}>
            {links.map(link => <li key={crypto.randomUUID()}>
                <Link href={link.href}>{link.text}</Link>
            </li>)}
            {children ? Array.isArray(children) ? children.map(child => <li key={crypto.randomUUID()}>
                {child}
            </li>) : <li>
                {children}
            </li>: null}
        </ul>
    </nav>
}