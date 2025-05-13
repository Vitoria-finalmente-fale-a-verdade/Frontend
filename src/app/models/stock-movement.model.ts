import { PropertyModel } from "./property.model";

export interface StockMovementModel {
  id: string;
  inventoryItemId: string;
  inventoryItemName: string;
  inventoryItemUnit: string;
  propertyId: string;
  property: PropertyModel;
  movementType: number;
  quantity: number;
  movementDate: Date;
  unitValue: number;
  activityId: string;
  activity: string;
  cropId: string;
  crop: string;
  notes: string;
}
