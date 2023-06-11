import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

export default function SlideShow( {images, width, height} ) {

    return (
        <div>
            <AliceCarousel animationType="slide" infinite autoPlay autoPlayInterval="1500">
                {
                    images.map((i) => <img src={i} className="sliderimg" alt="" style={{width: width, height: height}}/>)
                }
            </AliceCarousel>
        </div>
        
    )
}
