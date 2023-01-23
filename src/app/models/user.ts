import { Branch } from "./branch";

export class User {
    id?:number;
    username?:string;
    email?:string;
    status?:boolean;
    branch?:Branch;
    password?:string;
    accessToken?:string;
}

