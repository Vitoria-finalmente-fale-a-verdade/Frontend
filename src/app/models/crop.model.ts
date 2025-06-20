export interface CropModel {
  id: string;
  name: string;
  implantationDate: Date;
  area: number;
  unitValue: number;
  totalValue: number;
  lifeCycle: number;
  isDepreciable: boolean;
  annualDepreciation: number;
  annualValue: number;
}
