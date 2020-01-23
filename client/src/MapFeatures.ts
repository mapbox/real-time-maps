export type Feature = {
  id: string;
  precinct: string;
  status: number | null;
};

export type FeatureSet = { [key: string]: Feature };
