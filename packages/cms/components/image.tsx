import { type ImgHTMLAttributes } from "react";

export const Image = ({
  src,
  alt = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => {
  if (!src) return null;

  return <img src={src as string} alt={alt} {...props} />;
};
