export interface LazyTableDataModel {
  headers: {
    title: string;
    field: string;
    type?: "string" | "boolean" | "currency" | "date";
    center?: boolean;
    unit?: string;
  }[];
  actions?: {
    id: string;
    icon: string;
    severity?: "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast";
  }[];
  data: any[];
}
