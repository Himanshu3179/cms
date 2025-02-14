export type ChatModel = {
  author: string;
  modelId: string;
};

// ✅ Mapping author names to model IDs
export const AVAILABLE_MODELS: ChatModel[] = [
  {
    author: "faint-ecuador-football-author",
    modelId:
      "ft:gpt-4o-2024-08-06:suril:faint-ecuador-football-author:Aaisu7D4",
  },
  { author: "oterol", modelId: "ft:gpt-4o-2024-08-06:suril:oterol:AdDTLdiv" },
  { author: "pancho", modelId: "ft:gpt-4o-2024-08-06:suril:pancho:AdDSWwh4" },
  {
    author: "faint-ecuador-football-author-mini",
    modelId:
      "ft:gpt-4o-mini-2024-07-18:suril:faint-ecuador-football-author-mini:AaixLK8L",
  },
  {
    author: "jorge-journalist",
    modelId: "ft:gpt-4o-mini-2024-07-18:suril:jorge-journalist:AagBG1Te",
  },
  {
    author: "jorge",
    modelId: "ft:gpt-4o-mini-2024-07-18:suril:jorge:Aa4VgXag",
  },
  {
    author: "studiofutbol-adrian",
    modelId: "ft:gpt-4o-mini-2024-07-18:suril:studiofutbol-adrian:Ahhj2ut0",
  },
  {
    author: "studiofutbol-brian",
    modelId: "ft:gpt-4o-mini-2024-07-18:suril:studiofutbol-brian:Ahhlkv4H",
  },
  {
    author: "studiofutbol-jalencastro",
    modelId:
      "ft:gpt-4o-mini-2024-07-18:suril:studiofutbol-jalencastro:AhiNmVnA",
  },
  {
    author: "studiofutbol-juanjo",
    modelId: "ft:gpt-4o-mini-2024-07-18:suril:studiofutbol-juanjo:Ahhocz5R",
  },
  {
    author: "studiofutbol-redaccion",
    modelId: "ft:gpt-4o-mini-2024-07-18:suril:studiofutbol-redaccion:AhiLq394",
  },
  {
    author: "studiofutbol-victor",
    modelId: "ft:gpt-4o-mini-2024-07-18:suril:studiofutbol-victor:AhiHNiWM",
  },
];

// ✅ Function to get model by author name
export const getModelByAuthor = (author: string): string | null => {
  const model = AVAILABLE_MODELS.find((m) => m.author === author);
  return model ? model.modelId : null;
};
