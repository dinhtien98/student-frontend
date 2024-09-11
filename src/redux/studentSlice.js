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
      const res = await axios.post(BASE_URL, student);
      return res.data;
  
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const editStudent = createAsyncThunk(
  "student/editStudent",
  async ({id, std}, thunkAPI) => {
    try {
      const res = await axios.put(BASE_URL + "/" + id, std);
      console.log(res.data)
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
const studentSlice = createSlice({
  name: "student",
  initialState: {
    students: null,
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
      });
  },
});

export const { resetStatusAndMessage } = studentSlice.actions;
export default studentSlice.reducer;
