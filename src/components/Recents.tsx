import { useNavigate } from "react-router-dom";
import { ImageAsset } from "../../stare-into-the-void-functions/src/models/image-assets";
import ImagePreview from "./ImagePreview";

interface RecentsProps {
    imgs: ImageAsset[];
}

export default function Recents({
    imgs,
}: RecentsProps) {
    const navigate = useNavigate();
    const results: any[] = [];
    const now = new Date();
    let idx = 0;
    imgs.forEach(img => {
        results.unshift(
        <ImagePreview 
            key={img.title}
            title={img.title} 
            url={img.urls.orig} 
            lastOpened={now.toUTCString().substring(0, 16)} 
            onClick={() => navigate("/edit", { state: img })}
        />
        );
        idx++;
    })
    return(
        <div className="flex flex-wrap justify-between">
            { results }
        </div>
    );
}
