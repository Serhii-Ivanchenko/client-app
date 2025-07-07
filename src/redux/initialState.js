export const initialState = {
  auth: {
    userData: {},
    balance: {},
    apiKey: null,
    isLoggedIn: false,
    isRefreshing: false,
    isLoading: false,
    error: null,
  },

  cars: {
    cars: [],
    carInfo: {},
    nodesAndPartsForDiagnostics: [],
    diagnostic: {},
    repairDetails: {},
    chosenDate: '',
    newCar: {},
    convertedMedia: [],
    mileageOrVin: {},

    isLoading: false,
    isRecognitionLoading: false,
    isDiagLoading: false,
    isDiagCreateLoading: false,
    isSavingCarLoading: false,
    isRepairLoading: false,
    isConvertingMedia: false,
    isMileageOrVinLoading: false,

    error: null,
  },
};
