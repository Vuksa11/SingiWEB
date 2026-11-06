import Image from "next/image";

export default function Grb({ size = 44, className = "" }: { size?: number; className?: string }) {
  return <Image src="/grb-veliki.png" width={size} height={size} alt="Grb VK Singidunum" className={`shrink-0 rounded-full ${className}`} />;
}
