import { useEffect, useState } from "react";
import Image from "next/image";
import ImageUploading, { ImageListType } from "react-images-uploading";
import styles from "./ImagesUpload.module.css";
import { Button } from "components";
import { ButtonVariants } from "enums";

const ImagesUpload = ({onChangeImg,imgs,multiple}:any) => {
  const [images, setImages] = useState([]);
  const maxNumber = 9;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    
    setImages(imageList as never[]);
    onChangeImg(imageList);
  };

  useEffect(() => {
    if(imgs != null){
      setImages(imgs);
    onChangeImg(imgs);
    }
  },[imgs]);

  return (
    <div className={styles.container}>
      <ImageUploading
        multiple={multiple}
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper" {...dragProps}>
            <div className={styles.mainButtons}>
              <Button
                variant={ButtonVariants.PRIMARY}
                label={
                  images.length < maxNumber
                    ? "Upload new image"
                    : "Maximum 9 allowed"
                }
                onClick={(e) =>{
                  e.preventDefault();
                  return images.length < maxNumber ? onImageUpload() : null
                }
                  
                }
              />
              {images.length ? (
                <Button
                  variant={ButtonVariants.SECONDARY}
                  label="Remove all images"
                  onClick={(e) => {
                    e.preventDefault();
                    return onImageRemoveAll();
                  }}
                />
              ) : null}
            </div>
            <div className={styles.imagesContainer}>
              {imageList.map((image, index) => (
                <div key={index} className={styles.imageItem}>
                  <div className={styles.singleImage}>
                    <Image
                      src={image.dataURL as any}
                      layout="fill"
                      objectFit="cover"
                      /* width={200}
                      height={200} */
                    />
                  </div>
                  <div className={styles.imageItemButtonWrapper}>
                    <Button
                      label="Update"
                      variant={ButtonVariants.TEXT}
                      onClick={(e) => {
                        e.preventDefault();
                        return onImageUpdate(index);
                      }}
                    />
                    <Button
                      label="Remove"
                      variant={ButtonVariants.TEXT}
                      onClick={(e) => {
                        e.preventDefault();
                        return onImageRemove(index);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImagesUpload;
