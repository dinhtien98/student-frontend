import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wait } from "@testing-library/user-event/dist/utils";

import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/student";

export const getAll = createAsyncThunk(
  "student/getAll",
  async ({ currentPage, limit }, thunkAPI) => {
    const url = BASE_URL + `/list?page=${currentPage}&limit=${limit}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "student/deleteStudent",
  async (id) => {
    await axios.delete(BASE_URL + "/" + id);
    return id;
  }
);
export const addStudent = createAsyncThunk(
  "student/addStudent",
  async (student, thunkAPI) => {
    try {
      const response = await axios.post(BASE_URL, student);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editStudent = createAsyncThunk(
  "student/editStudent",
  async ({ id, std }, thunkAPI) => {
    try {
      const response = await axios.put(BASE_URL + "/" + id, std);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const searchStudent = createAsyncThunk(
  "student/searchStudent",
  async (searchTerm, thunkAPI) => {
    try {
      const response = await axios.get(BASE_URL + `/search?name=${searchTerm}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchStudent1 = createAsyncThunk(
  "student/searchStudent1",
  async ({ startYear, endYear }, thunkAPI) => {
    try {
      const response = await axios.get(
        BASE_URL + `/search1?startYear=${startYear}&endYear=${endYear}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const search = createAsyncThunk(
  "student/search",
  async ({ rating, name, city, startYear, endYear }, thunkAPI) => {
    try {
      const response = await axios.get(
        BASE_URL +
          `/search2?rating=${rating}&name=${name}&city=${city}&startYear=${startYear}&endYear=${endYear}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "student/uploadImage",
  async ({ id, formData }, thunkAPI) => {
    const url = BASE_URL + `/uploads/${id}`;
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); 
    }
  }
);

export const getAllStudentDetail = createAsyncThunk(
  "student/getAllStudentDetail",
  async (id, thunkAPI) => {
    const url = BASE_URL + `/getAllImage/${id}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); 
    }
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState: {
    students: null,
    studentDetails:null,
    totalPages: 10,
    status: null,
    error: null,
    message: "",
  },
  reducers: {
    resetStatusAndMessage: (state) => {
      state.error = null;
      state.status = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        state.students = action.payload.data.studentResonseList;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(getAll.rejected, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.error = action.payload.data;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.error = action.payload.data;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.error = action.payload.data;
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.students = state.students.map((student) =>
          student.id === action.payload.data.id ? action.payload.data : student
        );
      })
      .addCase(editStudent.rejected, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.error = action.payload.data;
      })
      .addCase(searchStudent.fulfilled, (state, action) => {
        state.students = action.payload.data;
        state.status = action.payload.status;
      })
      .addCase(searchStudent.rejected, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.error = action.payload.data;
      })
      .addCase(searchStudent1.fulfilled, (state, action) => {
        state.students = action.payload.data;
        state.status = action.payload.status;
      })
      .addCase(searchStudent1.rejected, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.error = action.payload.data;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.students = action.payload.data;
        state.status = action.payload.status;
      })
      .addCase(search.rejected, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.error = action.payload.data;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(getAllStudentDetail.fulfilled,(state,action)=>{
        state.studentDetails = action.payload.data;
        state.status = action.payload.status;
      })
      .addCase(getAllStudentDetail.rejected,(state,action)=>{
        state.status = action.payload.status;
        state.message = action.payload.message;
        state.error = action.payload.data;
      })
      ;
  },
});

export const { resetStatusAndMessage } = studentSlice.actions;
export default studentSlice.reducer;
