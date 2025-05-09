import { ActivityModel } from "./activity.model";
import { CropModel } from "./crop.model";
import { ProductModel } from "./product.model";
import { PropertyModel } from "./property.model";

export interface StockMovementModel {
  id: string;
  product_id: string;
  product: ProductModel;
  property_id: string;
  property: PropertyModel;
  movement_type: number;
  quantity: number;
  movement_date: Date;
  unit_value: number;
  related_activity_id: string;
  activity: ActivityModel;
  related_crop_id: string;
  crop: CropModel;
  notes: string;
}
