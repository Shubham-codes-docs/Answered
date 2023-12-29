import React from "react";
import Image from "next/image";
import Link from "next/link";

interface metricProps {
  imgUrl: string;
  alt: string;
  text: string;
  value: number | string;
  textStyle?: string;
  isAuthor?: boolean;
  href?: string;
}

const Metrics = ({
  imgUrl,
  alt,
  text,
  value,
  textStyle,
  isAuthor,
  href,
}: metricProps) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        height={16}
        width={16}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyle} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {text}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center justify-center gap-1">
        {metricContent}
      </Link>
    );
  }
  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metrics;
