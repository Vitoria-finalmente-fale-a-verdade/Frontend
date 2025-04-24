export interface LazyTableDataModel {
  headers: {
    title: string;
    field: string;
    type?: "string" | "boolean" | "currency" | "date";
    center?: boolean;
    unit?: string;
    sortable?: boolean;
  }[];
  actions?: {
    id: string;
    icon: string;
    severity?: "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast";
  }[];
  preSort?: {
    field: string;
    descending?: boolean;
  };
  data: any[];
}
