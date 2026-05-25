import { Patient } from "./patient";

export interface Treatment {
    id: string;
    type: string;
    values: Record<string, any>;    
    patient: Patient;
    createdDate: string;
    modifiedDate: string;
    isDeleted: boolean;
    status: string;
}
