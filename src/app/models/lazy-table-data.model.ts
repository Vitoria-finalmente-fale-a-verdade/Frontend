export interface LazyTableDataModel {
  headers: {
    title: string;
    field: string;
  }[];
  actions?: {
    id: string;
    icon: string;
    severity?: "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast";
  }[];
  data: any[];
}
