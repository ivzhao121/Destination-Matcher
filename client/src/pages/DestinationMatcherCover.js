import SlideShow from '../components/SlideShow';
import { useState, useEffect } from "react";
import SplitPane from "react-split-pane";
import { Slide } from '@mui/material';
import IntroductionPane from '../components/PostCard';

export default function DestinationMatcherCover() {
    const width = "800px"
    const height = "1000px"
    const images = [
        "https://i.insider.com/5db1eb92045a31175f283ad8?width=1000&format=jpeg&auto=webp",
        "https://media-cdn.tripadvisor.com/media/photo-m/1280/1d/81/30/3f/caption.jpg",
        "https://res.klook.com/image/upload/Mobile/City/swox6wjsl5ndvkv5jvum.jpg",
        "https://i.insider.com/5db2169f045a3125cb50e8d7?width=1300&format=jpeg&auto=webp",        
        "https://i.insider.com/5db1a6f8045a3144b23db8f8?width=1000&format=jpeg&auto=webp",
        "https://i.insider.com/5db1e41e045a3159b543bec4?width=1000&format=jpeg&auto=webp",
        "https://i.insider.com/5a70ec6e46a28861128b479c?width=1000&format=jpeg&auto=webp",
        "https://i.insider.com/5db1e7c6045a315ab232a384?width=1000&format=jpeg&auto=webp",
        "https://i.insider.com/5db1f9a3045a3152f55c5897?width=1000&format=jpeg&auto=webp",
        "https://i.insider.com/5d2f7e0d36e03c04f7033434?width=1300&format=jpeg&auto=webp"
    ]

    return (
        <div>
            <SplitPane
                split="vertical"
                minSize={100}
                maxSize={-100}
                defaultSize={"50%"}
            >
                <SlideShow images={images} width={width} height={height} />
                <IntroductionPane />
            </SplitPane>
        </div>

    )
}
