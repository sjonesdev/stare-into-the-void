// Represent the data as its been retrieved from the APIs. These are to be converted to ImageAssets before using in frontend code

interface MRPCamera{
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
}

interface MRPRover{
    id: number;
    name: string;
    landing_date: Date;
    launch_date: Date;
    status: string;
}

export interface MRPResponse{
    id: number;
    sol: number;
    camera: MRPCamera;
    img_src: string;
    earth_date: Date;
    rover: MRPRover;
}

export interface APODResponse{
    copyright: string;
    date: Date;
    explanation:string;
    hd_url:string;
    media_type: string;
    service_version: string;
    title:string;
    url: string;
}

interface NIVLData{
    center: string;
    date_created: Date;
    description: string;
    keywords: string[];
    media_type: string;
    nasa_id: string;
    title: string;
}

interface NIVLLinks{
    href: string;
    rel: string;
    render: string;
}

export interface NIVLResponse{
    data: NIVLData;
    href: string;
    links: NIVLLinks;
}
