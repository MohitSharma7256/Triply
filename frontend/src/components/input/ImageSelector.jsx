import React, { useEffect, useRef, useState } from "react";
import { FaRegFileImage } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import Slider from "react-slick";

const ImageSelector = ({ image = [], setImage, handleDeleteImg }) => {
  const inputRef = useRef(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length) {
      const updated = [...image, ...files];
      setImage(updated);
    }
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...image];
    updatedImages.splice(index, 1);
    setImage(updatedImages);
    if (handleDeleteImg) handleDeleteImg(index);
  };

  useEffect(() => {
    const urls = image.map((img) =>
      typeof img === "string" ? img : URL.createObjectURL(img)
    );
    setPreviewUrls(urls);

    return () => {
      // Clean up created URLs
      image.forEach((img) => {
        if (img instanceof File) {
          URL.revokeObjectURL(img);
        }
      });
    };
  }, [image]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        multiple
        className="hidden"
      />

      <button
        type="button"
        onClick={onChooseFile}
        className="w-full h-14 flex items-center justify-center gap-4 bg-cyan-50 rounded-lg border border-cyan-200 hover:bg-cyan-100 transition mb-3"
      >
        <div className="w-10 h-10 flex items-center justify-center bg-cyan-100 rounded-full">
          <FaRegFileImage className="text-xl text-cyan-600" />
        </div>
        <span className="text-sm text-slate-600 font-medium">
          Browse image files to upload
        </span>
      </button>

      {previewUrls.length > 0 && (
        <div className="relative w-full max-w-lg mx-auto rounded shadow">
          <Slider {...settings}>
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`preview-${index}`}
                  className="w-full h-64 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-500 group"
                  title="Remove Image"
                >
                  <MdDeleteOutline className="text-red-500 group-hover:text-white" />
                </button>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
