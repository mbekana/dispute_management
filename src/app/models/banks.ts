export class Banks {
    id?:number;
    swiftCode?:string;
    bankName?:string;
}

export class BanksResponse{ 
    content?: Banks[];
    singleBank?:Banks;
    message?:string;
}

