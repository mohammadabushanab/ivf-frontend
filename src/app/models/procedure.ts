import { Patient } from "./patient";
import { ProcedureType } from "./procedure-type";
import { User } from "./user";

export interface Procedure {
    id: string;
    values: Record<string, any>;
    paymentStatus: string;
    procedureType: ProcedureType;
    patient: Patient;
    physician: User;
    embryologist: User;
    qrCode: string;
    createdDate: string;
    modifiedDate: string;
    isPaid: boolean;
    isReport: boolean;
    dateSearchType: string;
    fromDate: string;
    toDate: string;
    scheduledDate: string;
    notes:string;

}
