import Image from "next/image";
import Link from "next/link";

export default function Logo1() {
  return (
    <Link className="logo1" href="/">
      <Image
        src="/logo1.svg"
        alt="루디움 홈 화면으로 바로가기"
        width={70}
        height={32}
        priority
      />
    </Link>
  );
}
