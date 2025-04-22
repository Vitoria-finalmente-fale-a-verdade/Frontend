import {ActivityModel} from './activity.model';

export default interface MachineryModel {
  id: string;
  activity: ActivityModel,
  description: string;
  acquisitionDate: Date;
  acquisitionValue: number;
  residualValue: number;
  serviceLife: number;
  isDepreciable: boolean;
  annualDepreciation: number;
  currentValue: number;
}
