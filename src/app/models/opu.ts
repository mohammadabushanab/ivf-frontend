import { Patient } from "./patient";

export interface OPU {
    id: string;
    values: Record<string, any>;    
    patient: Patient;
    createdDate: string;
    modifiedDate: string;
    isDeleted: boolean;
}
