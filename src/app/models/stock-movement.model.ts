import { PropertyModel } from "./property.model";
import {InventoryItemModel} from './inventory-item.model';
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
  cropId: string;
  crop: CropModel;
  notes: string;
}
