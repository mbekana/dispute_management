export interface Requester {
    id?: any,
    cardNumber?: number,
    accountNumber?: number,
    address?:string,
    telephone?: string,
    transactionTime?: Date,
    transcationAmount?: number,
    nameOfBankOrATM?: string,
    requesersName?: string,
    branch_name?: string,
    checked?: false,
    approved?: false,
    unread?:true,
    createDate?: Date,
    modifyDate?: Date
}
