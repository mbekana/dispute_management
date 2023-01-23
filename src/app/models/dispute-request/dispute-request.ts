import { Banks } from "../banks";
import { Page } from "../page/page";

export class DisputeRequest {
    cardNumber!: number;
    cardHolderName!: string;
    address!: string;
    transactionDate!: Date;
    transactionAmount!:number;
    requestInitiatorBranch!: string;
    telephone!: string;
    accountNumber!: string;
    bank!:Banks;
    customerStatement!: boolean;
}


export class DisputeRequestResponse
{
    "_embedded":{
        disputeRequestDtoes:DisputeRequest[]
    }

  page!:Page
}
