import { PropertyModel } from "./property.model";

export interface ProductModel {
  id: string;
  itemType: number;
  name: string;
  description: string;
  propertyId: string;
  property: PropertyModel;
  unitOfMeasure: string;
  currentStockLevel: number;

}
