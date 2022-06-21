const PlannerTabsNames = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

const FOOD_TAB_NAME = 'Food List'
const META_TAB_NAME = 'meta'

const MetaSheetCellsInfo = {
  INTERVAL: 'F6:F10',
  CALORIES: 'F6',
  PROTEINS: 'F7',
  CARBS: 'F8',
  FAT: 'F9',
}
const FoodsSheetCellsInfo = {
  INTERVAL: 'A2:F',
  NAME_COLUMN: 'A',
  CALORIES_COLUMN: 'B',
  PROTEINS_COLUMN: 'C',
  CARBS_COLUMN: 'D',
  FAT_COLUMN: 'E',
  NOTES_COLUMN: 'F',
}

const WeekPlanSheetCellsInfo = {
  INTERVAL: 'A4:B',
  FOOD_NAME_COLUMN: 'A',
  QUANTITY_COLUMN: 'B',
}

export {
  PlannerTabsNames,
  FOOD_TAB_NAME,
  META_TAB_NAME,
  MetaSheetCellsInfo,
  FoodsSheetCellsInfo,
  WeekPlanSheetCellsInfo,
}
