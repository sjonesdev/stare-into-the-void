//Represent the data as its been retrieved from the APIs. These are to be converted to ImageAssets before using in frontend code

class MRPCamera{
    public id: number;
    public name: string;
    public rover_id: number;
    public full_name: string;

    constructor(id: number, name: string, rover_id: number, full_name: string){
        this.id = id;
        this.name = name;
        this.rover_id = rover_id;
        this.full_name = full_name;
    }
}

class MRPRover{
    public id: number;
    public name: string;
    public landing_date: Date;
    public launch_date: Date;
    public status: string;

    constructor(id: number, name: string, landing_date: Date, launch_date: Date, status: string) {
        this.id = id;
        this.name = name
        this.landing_date = landing_date;
        this.launch_date = launch_date;
        this.status = status;
    }
}

export class MRPResponse{
    public id: number;
    public sol: number;
    public camera: MRPCamera;
    public img_src: string;
    public earth_date: Date;
    public rover: MRPRover;

    constructor(id: number, sol: number, camera: MRPCamera, img_src: string, earth_date: Date, rover: MRPRover){
        this.id = id;
        this.sol = sol;
        this.camera = camera
        this.img_src = img_src;
        this.earth_date = earth_date;
        this.rover = rover;
    }

    get title(): string{
        return this.rover.name + " rover image " + this.id;
    }
    
    get description(): string{
        return "This image was taken by the " + this.rover.name + " rover with its " + this.camera.name + "on Martian sol " + this.sol + ".";
    }
}

export class APODResponse{
    public copyright: string;
    public date: Date;
    public explanation:string;
    public hd_url:string;
    public media_type: string;
    public service_version: string;
    public title:string;
    public url: string;

    constructor(copyright: string, date: Date, explanation: string, hd_url: string, media_type: string, service_version: string, title: string, url: string){
        this.copyright = copyright;
        this.date = date;
        this.explanation = explanation;
        this.hd_url = hd_url
        this.media_type = media_type;
        this.service_version = service_version;
        this.title = title;
        this.url = url;
    }
}

class NIVLData{
    center: string;
    date_created: Date;
    description: string;
    keywords: string[];
    media_type: string;
    nasa_id: string;
    title: string;

    constructor(center: string, date_created: Date, description: string, keywords: string[], media_type: string, nasa_id: string, title: string){
        this.center = center;
        this.date_created = date_created;
        this.description = description;
        this.keywords = keywords;
        this.media_type = media_type;
        this.nasa_id = nasa_id;
        this.title = title;
    }
}

class NIVLLinks{
    href: string;
    rel: string;
    render: string;

    constructor(href: string, rel: string, render: string){
        this.href = href;
        this.rel = rel;
        this.render = render;
    }
}

export class NIVLResponse{
    data: NIVLData;
    href: string;
    links: NIVLLinks;

    constructor(data: NIVLData, href: string, links: NIVLLinks){
        this.data = data;
        this.href = href;
        this.links = links;
    }
}