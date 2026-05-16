export interface User {
    id: string;      
    name: string;
    email: string;  
    password:string;
    phoneNumber: string;
    role: string;
    token: string;
    isLoggedIn:boolean;
    newPassword:string;
}