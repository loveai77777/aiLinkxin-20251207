import Image, { ImageProps } from "next/image";

interface AppImageProps extends Omit<ImageProps, "alt"> {
  alt: string; // alt 属性必须提供
  quality?: number;
}

/**
 * 统一的图片组件
 * - 强制要求 alt 属性
 * - 默认质量 75
 * - 默认懒加载
 */
export default function AppImage({
  alt,
  quality = 75,
  loading = "lazy",
  ...props
}: AppImageProps) {
  return (
    <Image
      alt={alt}
      quality={quality}
      loading={loading}
      {...props}
    />
  );
}


















