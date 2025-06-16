export type Model = {
  name: string;
  model: string;
  size: number;
  modified_at: string;
};

export type ListModelsResponse = {
  models: Model[];
};
