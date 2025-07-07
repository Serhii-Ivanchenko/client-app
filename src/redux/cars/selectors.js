export const selectCars = state => state.cars.cars;

export const selectCarInfo = state => state.cars.carInfo;

export const selectNodesAndPartsForDiagnostics = state =>
  state.cars.nodesAndPartsForDiagnostics;

export const selectDiagnostic = state => state.cars.diagnostic;

export const selectDate = state => state.cars.chosenDate;

export const selectRepair = state => state.cars.repairDetails;

export const selectNewCar = state => state.cars.newCar;

export const selectConvertedMedia = state => state.cars.convertedMedia;

export const selectMileageOrVin = state => state.cars.mileageOrVin;

// Loaders

export const selectIsLoading = state => state.cars.isLoading;

export const selectIsRecognitionLoading = state =>
  state.cars.isRecognitionLoading;

export const selectIsDiagLoading = state => state.cars.isDiagLoading;

export const selectIsDiagCreateLoading = state =>
  state.cars.isDiagCreateLoading;

export const selectIsRepairLoading = state => state.cars.isRepairLoading

export const selectIsSavingCarLoading = state =>
  state.cars.isSavingCarLoading;

export const selectIsConvertingMedia = state =>
  state.cars.isConvertingMedia;

export const selectIsMileageOrVinLoading = state =>
  state.cars.isMileageOrVinLoading;

export const selectError = state => state.cars.error;
