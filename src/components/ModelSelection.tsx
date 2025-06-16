export const ModelSelection = ({
  models,
  selectedModel,
  onSelect = () => {},
}: {
  models: string[];
  selectedModel: string;
  onSelect?: (model: string) => void;
}) => {
  const onElementSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = event.target.value;
    onSelect(model);
  };

  return (
    <div className="model-selection">
      <select
        id="model-select"
        className="model-select"
        value={selectedModel}
        onChange={onElementSelect}
      >
        <option value="">Select model...</option>
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};
