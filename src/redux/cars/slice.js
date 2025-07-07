import { initialState } from '../initialState.js';
import { createSlice } from '@reduxjs/toolkit';
import {
  createDiagnostic,
  createNewCar,
  editVINorMileage,
  getAllCars,
  getDiagnostic,
  getMileageOrVinFromPhoto,
  getNodesAndParts,
  getRepair,
  recognizeLicensePlate,
  updateCar,
  updateRepair,
  uploadCarPhotos,
  uploadMedia,
} from './operations.js';

const handlePending = state => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  {
    state.isLoading = false;
    state.error = action.payload;
  }
};

const carsSlice = createSlice({
  name: 'cars',
  initialState: initialState.cars,
  reducers: {
    setChosenDate: (state, action) => {
      state.chosenDate = action.payload;
    },
    clearChosenDate: state => {
      state.chosenDate = '';
    },
    deleteCarInfo: state => {
      state.carInfo = {};
      state.isRecognitionLoading = false;
      state.error = null;
    },
    deleteMileageOrVin: state => {
      state.mileageOrVin = {};
      state.isMileageOrVinLoading = false;
      state.error = null;
    },
    clearDiag: state => {
      state.diagnostic = {};
    },
    clearRepair: state => {
      state.repairDetails = {};
    },
  },
  extraReducers: builder =>
    builder
      // Get all cars
      .addCase(getAllCars.pending, handlePending)
      .addCase(getAllCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload;
      })
      .addCase(getAllCars.rejected, handleRejected)

      // Recognize license plate
      .addCase(recognizeLicensePlate.pending, state => {
        state.isRecognitionLoading = true;
        state.error = null;
      })
      .addCase(recognizeLicensePlate.fulfilled, (state, action) => {
        state.isRecognitionLoading = false;
        if (!action.payload.car_info) {
          state.carInfo.license_plate = action.payload.license_plate;
        } else {
          state.carInfo = action.payload.car_info;
        }
      })
      .addCase(recognizeLicensePlate.rejected, (state, action) => {
        state.isRecognitionLoading = false;
        state.error = action.payload;
      })

      // Edit VIN or mileage
      .addCase(editVINorMileage.pending, handlePending)
      .addCase(editVINorMileage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { car_id, vin, mileage } = action.meta.arg;

        const carToEdit = state.cars.find(car => car.car_id === car_id);

        if (carToEdit && vin) {
          carToEdit.vin = vin;
        }
        if (carToEdit && mileage) {
          carToEdit.mileage = mileage;
        }
      })

      //! DIAGNOSTICS
      .addCase(getNodesAndParts.pending, handlePending)
      .addCase(getNodesAndParts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nodesAndPartsForDiagnostics = action.payload.tree.nodes;
      })
      .addCase(getNodesAndParts.rejected, handleRejected)

      .addCase(getDiagnostic.pending, (state, action) => {
        state.isDiagLoading = true;
        state.error = null;
      })
      .addCase(getDiagnostic.fulfilled, (state, action) => {
        state.isDiagLoading = false;
        state.diagnostic = action.payload;
      })
      .addCase(getDiagnostic.rejected, (state, action) => {
        state.isDiagLoading = false;
        state.error = action.payload;
      })

      .addCase(createDiagnostic.pending, (state, action) => {
        state.isDiagCreateLoading = true;
        state.error = null;
      })
      .addCase(createDiagnostic.fulfilled, (state, action) => {
        state.isDiagCreateLoading = false;
      })
      .addCase(createDiagnostic.rejected, (state, action) => {
        state.isDiagCreateLoading = false;
        state.error = action.payload;
      })

      // ! Repair

      .addCase(getRepair.pending, (state, action) => {
        state.isRepairLoading = true;
        state.error = null;
      })
      .addCase(getRepair.fulfilled, (state, action) => {
        state.isRepairLoading = false;
        state.repairDetails = action.payload.repair;
      })
      .addCase(getRepair.rejected, (state, action) => {
        state.isRepairLoading = false;
        state.error = action.payload;
      })

      .addCase(updateRepair.pending, (state, action) => {
        state.isRepairLoading = true;
        state.error = null;
      })
      .addCase(updateRepair.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateRepair.rejected, (state, action) => {
        state.isRepairLoading = false;
        state.error = action.payload;
      })

      // ! New car
      // create new car
      .addCase(createNewCar.pending, (state, action) => {
        state.isSavingCarLoading = true;
        state.error = null;
      })
      .addCase(createNewCar.fulfilled, (state, action) => {
        state.isSavingCarLoading = false;
        state.newCar = action.payload.car_data;
      })
      .addCase(createNewCar.rejected, (state, action) => {
        state.isSavingCarLoading = false;
        state.error = action.payload;
      })

      // Upload car photos
      .addCase(uploadCarPhotos.pending, (state, action) => {
        state.isSavingCarLoading = true;
        state.error = null;
      })
      .addCase(uploadCarPhotos.fulfilled, (state, action) => {
        state.isSavingCarLoading = false;
      })
      .addCase(uploadCarPhotos.rejected, (state, action) => {
        state.isSavingCarLoading = false;
        state.error = action.payload;
      })

      // Update existing car
      .addCase(updateCar.pending, (state, action) => {
        state.isSavingCarLoading = true;
        state.error = null;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = state.cars.map(car =>
          car.id === action.payload.car_id
            ? { ...car, ...action.payload.updated_fields }
            : car
        );
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.isSavingCarLoading = false;
        state.error = action.payload;
      })

      // get mileage or vin from photo
      .addCase(getMileageOrVinFromPhoto.pending, state => {
        state.isMileageOrVinLoading = true;
        state.error = null;
      })
      .addCase(getMileageOrVinFromPhoto.fulfilled, (state, action) => {
        state.isMileageOrVinLoading = false;
        state.mileageOrVin = {
          ...(state.mileageOrVin || {}),
          ...action.payload,
        };
      })
      .addCase(getMileageOrVinFromPhoto.rejected, (state, action) => {
        state.isMileageOrVinLoading = false;
        state.error = action.payload;
      })

      // ! Upload media to convert
      .addCase(uploadMedia.pending, (state, action) => {
        state.isConvertingMedia = true;
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.isConvertingMedia = false;
        state.convertedMedia = action.payload.urls;
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.isConvertingMedia = false;
        state.error = action.payload;
      }),
});
export const {
  setChosenDate,
  clearChosenDate,
  deleteCarInfo,
  deleteMileageOrVin,
  clearDiag,
  clearRepair,
} = carsSlice.actions;

export default carsSlice.reducer;
