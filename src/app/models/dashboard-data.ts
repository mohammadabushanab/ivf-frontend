import { ProceduresCount } from "./procedures-count";

export interface DashboardData {
    totalPatients: number;
    totalProcedures: number;
    frozenEmbryos: number;
    frozenEggs: number;
    frozenSpermAmpoules: number;
    totalFreezingItems: number;
    proceduresCounts: ProceduresCount[];
}
