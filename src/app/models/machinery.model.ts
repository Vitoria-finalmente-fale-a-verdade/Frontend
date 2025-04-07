import {ExplorationModel} from './exploration.model';

export default interface MachineryModel {
  id: string;
  exploration: ExplorationModel,
  description: string;
  acquisitionDate: Date;
  acquisitionValue: number;
  residualValue: number;
  serviceLife: number;
  isDepreciable: boolean;
  annualDepreciation: number;
  currentValue: number;
}