export interface CardHolderResponse {
    content: CardHolder[];
    totalElements: number;
}
export interface CardHolder{
      custNumber: string;
      atmCardNumber:string;
      flexcubeAccountNumber:string;
      customerName:string;

}