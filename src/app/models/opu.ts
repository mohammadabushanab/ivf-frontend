import { Patient } from "./patient";

export interface OPU {
    id: string;
    values: Record<string, any>;   
    status:string; 
    patient: Patient;
    createdDate: string;
    modifiedDate: string;
    isDeleted: boolean;
}
