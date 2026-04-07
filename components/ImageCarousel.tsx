"use client";

import { useState } from "react";
import { image } from "../types/userService";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BiBorderRadius } from "react-icons/bi";

type ImageCarouselProps = {
    images: image[];
}

export default function ImageCarousel({ images } : ImageCarouselProps)  {
    const[currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return <div></div>;
    }

    const containerStyles: React.CSSProperties = {
    position: 'relative',
    height: '400px', 
    width: '100%',
    }

    const slideStyles: React.CSSProperties= {
        position: 'relative',
        width : '100%',
        height : '100%',
        borderRadius : '10px',
        backgroundImage: `url(${images[currentIndex].file_path})`,
        backgroundPosition : "center",
        backgroundSize : "cover",
    }
    
    const leftArrowStyles :React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        left: '32px',
        color : '#fff',
        zIndex: 1,
        cursor: "pointer",

    }

    const rightArrowStyles : React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        right: '32px',
        color : '#fff',
        zIndex: 1,
        cursor: "pointer",
        
    }

    const dotsContainerStyles: React.CSSProperties = {
        display : 'flex',
        justifyContent : 'center',
        position: 'absolute', 
        bottom: '10px',
        width: '100%',
    }

    const dotStyle = {
        margin: '0 3px',
        cursor : "pointer",
        fontsize: "20px",
        color: "#fff",
    }
    const goToSlide =  (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    }
    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ?  images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }
    const goToNext = () => {
        const newIndex = currentIndex === images.length - 1 ?  0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }
    return (
        <div style ={containerStyles}>
        <div style={slideStyles}>
            <div style={leftArrowStyles} onClick={goToPrevious}><FaChevronLeft /></div>
            <div style={(rightArrowStyles)} onClick={goToNext}><FaChevronRight /></div>
            <div style={slideStyles}></div>
            <div style = {dotsContainerStyles}>
            {images.map((slide, slideIndex) =>(
                <div key={slideIndex} style={dotStyle} onClick={() => goToSlide(slideIndex)}>•</div>
            ) )}
            </div>
        </div>
        </div>
    )
}
