import {ActivityModel} from './activity.model';

export interface CropModel {
  id: string;
  activityId: string;
  activity: ActivityModel,
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
