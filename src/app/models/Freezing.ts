import { Patient } from "./patient";
import { ProceduresCount } from "./procedures-count";

export interface Freezing {
    frozenEmbryos: number;
    frozenEggs: number;
    frozenSpermAmpoules: number;
    totalFreezingItems: number;
    id: number;
    type: string;
    total: number;
    remaining: number;
    dewar: string;
    canister: string;
    notes: string;
    date: string;
    patient: Patient;
}
