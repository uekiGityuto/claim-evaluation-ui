export class Card {
    public id: number;
    public title: string;
    public description: string;
    public button_desc: string;
    public img_uri: string;

    constructor(
        id: number,
        title: string,
        description: string,
        button_desc: string,
        img_uri: string
    ){
        this.id = id;
        this.title = title;
        this.description = description;
        this.button_desc = button_desc;
        this.img_uri = img_uri;
    }
}