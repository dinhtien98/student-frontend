import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Alert, Button, FormGroup, Label, Table } from "reactstrap";
import { getAllStudentDetail, resetStatusAndMessage, uploadImage } from "../../redux/studentSlice";
import axios from "axios";

export default function StudentDetail() {
  const { id } = useParams();
  const [files, setFile] = useState([]);
  const handle_change = (e) => {
    setFile(e.target.files);
  };
  const dispatch = useDispatch();
  const handle_submit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      dispatch(uploadImage({ id, formData })).then(()=>{
        dispatch(getAllStudentDetail(id))
      });
    } catch (error) {
      console.error("Error uploading files", error);
    }
  };
  const {studentDetails, message, error, status} =useSelector((state)=>state.student)
  const [images, setImage] = useState({})
  const fetchImage = async (imageUrl) =>{
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/student/images/${imageUrl}`,{
            responseType: 'blob'
        })
        const imageObjectURL = URL.createObjectURL(response.data)
        setImage(prev=>({...prev,[imageUrl]:imageObjectURL}))
    } catch (error) {
        console.error("Error fetch image", error);
    }
  }
  useEffect(()=>{
    if(studentDetails){
        studentDetails.forEach(item => {
            fetchImage(item.imageUrl)
        });
    }
  },[studentDetails,dispatch])
  useEffect(()=>{
    dispatch(getAllStudentDetail(id))
  },[dispatch,id])
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    if (status && message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        dispatch(resetStatusAndMessage());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, message]);
  return (
    <div>
      {
        showMessage && (
            <Alert color={status==200?"success":"danger"}>{message}</Alert>
        )
      }
      {
        error && (
            <Alert color="danger">
                <ul>
                    {
                        error.map((error,index)=>(
                            <li key={index}>{error}</li>
                        ))
                    }
                </ul>
            </Alert>
        )
      }
      <form onSubmit={handle_submit}>
        <FormGroup>
          <Label>Upload Image</Label>
          <input type="file" name="files" multiple onChange={handle_change} />
          <input type="submit" value="save" />
        </FormGroup>
      </form>
      <Table>
        <thead>
            <tr>
                <th>#</th>
                <th>ID</th>
                <th>Image</th>
                <th>delete</th>
            </tr>
        </thead>
        <tbody>
            {
                studentDetails && studentDetails.map((item,index)=>(
                    <tr key={index}>
                        <th scope="row">{index+1}</th>
                        <td>{item.id}</td>
                        <td>
                            <img src={images[item.imageUrl]} alt="Product" style={{width:'100px',height:'100px', objectFit:'cover'}}/>
                        </td>
                        <td>
                            <Button className="btn btn-danger">delete</Button>
                        </td>
                    </tr>
                ))
            }
        </tbody>
      </Table>
    </div>
  );
}
