import {IconDefinition} from '@fortawesome/free-solid-svg-icons';

export interface LazyTableDataModel {
  headers: {
    title: string;
    field: string;
    type?: "string" | "boolean" | "currency" | "date";
    center?: boolean;
    unit?: string;
    sortable?: boolean;
    dynamicValue?: (row: any, item: any) => any;
    dynamicClass?: (row: any, item: any) => string;
    prefix?: string;
    suffix?: string;
  }[];
  actions?: {
    id: string;
    icon: string;
    severity?: "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast";
  }[];
  navigators?: {
    id: string;
    icon: IconDefinition;
    tooltip?: string;
    severity?: "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast";
  }[];
  preSort?: {
    field: string;
    descending?: boolean;
  };
  data: any[];
}
