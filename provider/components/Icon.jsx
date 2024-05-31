import Image from "next/image";

export default function Icon({ className, src, alt, width, height }) {
  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
    />
  );
}
