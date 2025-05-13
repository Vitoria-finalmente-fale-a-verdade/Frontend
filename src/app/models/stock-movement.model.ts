import { ActivityModel } from "./activity.model";
import { CropModel } from "./crop.model";
import { InventoryItemModel } from "./inventoryItem.model";
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
  relatedActivityId: string;
  relatedActivityCategory: string;
  relatedCropId: string;
  relatedCropName: string;
  notes: string;
}
