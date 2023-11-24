import Link from "next/link";
import contentnavigationstyle from "./ContentNavigation.module.css";

export default function ContentNavigation({ links }) {
    return <nav className={contentnavigationstyle.wrapper}>
        <ul className={contentnavigationstyle.list}>
            {links.map(link => <li key={`${crypto.randomUUID()}`}>
                <Link href={link.href}>{link.text}</Link>
            </li>)}
        </ul>
    </nav>
}