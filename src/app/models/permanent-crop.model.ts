import {ExplorationModel} from './exploration.model';

export default interface PermanentCropModel {
  id: string;
  explorationId: string;
  exploration: ExplorationModel,
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
