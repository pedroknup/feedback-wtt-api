import { IFood } from "src/models/IFood";

export const isFoodValid = (food: IFood | undefined) =>
  food &&
  food.name !== undefined &&
  food.name !== null &&
  food.calories !== undefined &&
  food.calories !== null &&
  food.proteins !== undefined &&
  food.proteins !== null &&
  food.carbs !== undefined &&
  food.carbs !== null &&
  food.fat !== undefined &&
  food.fat !== null
