import React from 'react';

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt, className, containerClassName, loading = "lazy", ...props }) => {
  return (
    <div className={`relative h-full w-full overflow-hidden ${containerClassName || ''}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`${className || ''}`}
        {...props}
      />
    </div>
  );
};

export default ImageWithLoader;