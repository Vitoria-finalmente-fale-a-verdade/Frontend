import { PropertyModel } from "./property.model";
import {InventoryItemModel} from './inventory-item.model';
import {ActivityModel} from './activity.model';
import {CropModel} from './crop.model';

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
  activity: ActivityModel;
  cropId: string;
  crop: CropModel;
  notes: string;
}
