import Image from "next/image";
import Link from "next/link";

export default function Logo1() {
  return (
    <Link className="logo1" href="/">
      <Image src="/logo1.svg" alt="logo" width={70} height={32} priority />
    </Link>
  );
}
