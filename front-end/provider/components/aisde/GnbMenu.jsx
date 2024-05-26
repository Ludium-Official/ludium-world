import Image from "next/image";
import Link from "next/link";

export default function GnbMenu({
  href,
  src,
  alt,
  width,
  height,
  text,
  iconClass,
}) {
  return (
    <Link className="gnb-menu-2" href={href}>
      <div className="icon-28">
        <Image
          className={iconClass}
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
        />
      </div>
      <p className="text-wrapper h4-20">{text}</p>
    </Link>
  );
}
