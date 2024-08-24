"use client";
import classes from "./Slider.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowForward } from "react-icons/io";
import Image from "next/image";

export default function SliderComponent({ images }) {
  const carouselSettings = {
    infinite: true,
    speed: 500,
    lazyLoad: "ondemand", // Użyj 'ondemand' lub 'progressive'
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    cssEase: "linear",
    initialSlide: 0,
    nextArrow: (
      <div>
        <div className={classes.rightArrow}>
          <IoIosArrowForward />
        </div>
      </div>
    ),
    prevArrow: (
      <div>
        <div className={classes.rotate}>
          <IoIosArrowForward />
        </div>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1224,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className={classes.sliderContainer}>
      <Slider {...carouselSettings} className={classes.slider}>
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            height={image.height || 550}
            width={image.width || 450}
            layout="responsive"
            alt={image.alt || "Slider Image"}
          />
        ))}
      </Slider>
    </div>
  );
}
