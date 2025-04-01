export interface SidebarMenuModel {
  path: string;
  title: string;
  icon: string;
  roles?: string[];
  children?: SidebarMenuModel[];
  open?: boolean;
}
