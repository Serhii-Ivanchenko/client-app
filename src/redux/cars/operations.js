import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosInstance,
  axiosInstancePhotos,
  // axiosInstanceVinAndMileage,
} from '../../services/api.js';

// Get list of all cars per day
export const getAllCars = createAsyncThunk(
  'cars/getAllCars',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const { date, mechanic_id } = data;
      const response = await axiosInstance.get(`/mb/get_all_car/`, {
        params: {
          date,
          mechanic_id,
        },
        headers: {
          // 'X-Api-Key': 'YA7NxysJ',
          'company-id': serviceId,
        },
      });
      console.log('getAllCars', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// Recognize license plate
export const recognizeLicensePlate = createAsyncThunk(
  'cars/recognizeLicensePlate',
  async (platePhoto, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', platePhoto);
      const response = await axiosInstancePhotos.post(
        '/recognize_license_plate/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('recognizeLicensePlate', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// Edit VIN or mileage
export const editVINorMileage = createAsyncThunk(
  'cars/editVINorMileage',
  async (newData, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const { car_id, vin, mileage } = newData;
      const response = await axiosInstance.post(
        `/crm/edit_vin_or_mileage`,
        null,
        {
          params: { car_id, vin, mileage },
          headers: {
            // "X-Api-Key": "YA7NxysJ",
            'company-id': serviceId,
          },
        }
      );
      console.log('editVINorMileage', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// ! Diagnostics

// Get Nodes and Parts list
export const getNodesAndParts = createAsyncThunk(
  'cars/getNodesAndParts',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const response = await axiosInstance.get(`/mb/categories_with_parts`, {
        headers: {
          'company-id': serviceId,
        },
      });
      console.log('getNodesAndParts', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// Get particular diagnostic
export const getDiagnostic = createAsyncThunk(
  'cars/getDiagnostic',
  async (diagnostic_id, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const response = await axiosInstance.get(
        `/mb/get_report/${diagnostic_id}`,
        {
          headers: {
            'company-id': serviceId,
          },
        }
      );
      console.log('getDiagnostic', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// Create diagnostic
export const createDiagnostic = createAsyncThunk(
  'cars/createDiagnostic',
  async (diagnosticData, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const response = await axiosInstance.post(
        `/mb/create_diagnostic`,
        diagnosticData,
        {
          headers: {
            'company-id': serviceId,
          },
        }
      );
      console.log('createDiagnostic', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// ! Repair

// Get repair info
export const getRepair = createAsyncThunk(
  'cars/getRepair',
  async (repair_id, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const response = await axiosInstance.get(`/acc/get_repair/${repair_id}`, {
        headers: {
          // "X-Api-Key": "YA7NxysJ",
          'company-id': serviceId,
        },
      });
      console.log('getRepair', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// Update Repair Info
export const updateRepair = createAsyncThunk(
  'cars/updateRepair',
  async (updatedRepairData, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const { repair_id, ...repairData } = updatedRepairData;
      const response = await axiosInstance.patch(
        `/acc/update_repair/${repair_id}`,
        repairData,
        {
          headers: {
            // "X-Api-Key": "YA7NxysJ",
            'company-id': serviceId,
          },
        }
      );
      console.log('updateRepair', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// ! New car

// Create new car
export const createNewCar = createAsyncThunk(
  'cars/createNewCar',
  async (carData, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const response = await axiosInstance.post(`/mb/save_car/`, carData, {
        headers: {
          'company-id': serviceId,
          // 'X-Api-Key': 'YA7NxysJ',
        },
      });
      console.log('createNewCar', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// Upload car photos
export const uploadCarPhotos = createAsyncThunk(
  'cars/uploadCarPhotos',
  async (carData, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const { car_id, photos } = carData;
      // const formData = new FormData();

      // photos.forEach(photo => {
      //   formData.append('photos', photo);
      // });
      // formData.append('car_id', car_id);
      // formData.append('company_id', serviceId);
      const response = await axiosInstance.post(
        `/mb/upload_car_photos/?car_id=${car_id}`,
        photos,
        {
          headers: {
            'company-id': serviceId,
            // 'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('uploadCarPhotos', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// Update existing car

export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async (carDataToUpdate, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      const { car_id, ...dataToUpdate } = carDataToUpdate;

      const response = await axiosInstance.patch(
        `/crm/update_car/${car_id}`,
        dataToUpdate,
        {
          headers: {
            // "X-Api-Key": "YA7NxysJ",
            'company-id': serviceId,
          },
        }
      );
      console.log('updateCar', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Get mileage or VIN from photo
export const getMileageOrVinFromPhoto = createAsyncThunk(
  'cars/getMileageOrVinFromPhoto',
  async (photo, thunkAPI) => {
    console.log('photo', photo);

    try {
      const response = await axiosInstance.post(
        '/mb/ocr_vin_odometer/',
        photo,
        {
          headers: {
            // 'X-Api-Key': 'YA7NxysJ',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('getMileageOrVinFromPhoto', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);

// ! Upload media to convert

export const uploadMedia = createAsyncThunk(
  'cars/uploadMedia',
  async (media, thunkAPI) => {
    const state = thunkAPI.getState();
    const serviceId = state.auth.userData.selectedServiceId;
    try {
      // media_types: {"photos": "jpg", "audios": "mp3", "videos": "mp4"}
      const response = await axiosInstance.post(`/mb/upload_media/`, media, {
        headers: {
          'company-id': serviceId,
          // 'Content-Type': 'multipart/form-data',
        },
      });
      console.log('uploadMedia', response.data);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.message,
        details: error.response?.data.detail, // Залишаємо лише необхідні дані
      });
    }
  }
);
