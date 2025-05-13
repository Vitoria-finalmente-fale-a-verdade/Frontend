import { PropertyModel } from "./property.model";
import {InventoryItemModel} from './inventory-item.model';

export interface StockMovementModel {
  id: string;
  inventoryItemId: string;
  inventoryItem: InventoryItemModel;
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
