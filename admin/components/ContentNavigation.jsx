import Link from "next/link";
import contentnavigationstyle from "./ContentNavigation.module.css";

export default function ContentNavigation({ links, children }) {
    return <nav className={contentnavigationstyle.wrapper}>
        <ul className={contentnavigationstyle.list}>
            {links.map(link => <li key={`${crypto.randomUUID()}`}>
                <Link href={link.href}>{link.text}</Link>
            </li>)}
            {children ? Array.isArray(children) ? children.map(child => <li>
                {child}
            </li>) : <li>
            {children}
        </li> : null}
        </ul>
    </nav>
}