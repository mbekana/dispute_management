import { Page } from "../page/page";

export class CardHolder {
    adress1?:string;
    address2?:string;
    adress3?: string;
    mobile?: string;
    fcc_ACC_NO?:string;
    customername?: string;
    custnumber?: string;
    atm_CARD_NO?: string;
}


export class CardHolderResponse{
    "_embedded":{
        cardHolderDtoes:CardHolder[]
    }
    page?:Page
}