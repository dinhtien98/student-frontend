import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  ModalBody,
  Table,
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import {
  addStudent,
  deleteStudent,
  editStudent,
  getAll,
  resetStatusAndMessage,
} from "../../redux/studentSlice";
import ReactPaginate from "react-paginate";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";

export default function Student() {
  const [showMessage, setShowMessage] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    if (modal) {
      dispatch(resetStatusAndMessage);
    }
  };
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAll({ currentPage, limit }));
  }, [currentPage, dispatch]);
  const { totalPages, students, status, message, error } = useSelector(
    (state) => state.student
  );
  const [student, setStudent] = useState({
    name: "Mèo",
    city: "HCM",
    birthday: "2020-02-02",
    rating: "Gioi"
  });
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const handle_delete = (id) => {
    dispatch(deleteStudent(id)).then(() => {
      dispatch(getAll({ currentPage, limit }));
    });
  };
  const handle_add = () => {
    console.log(student)
    dispatch(addStudent(student))
    .then(() => {
      dispatch(getAll({ currentPage, limit }));
    });
    // setStudent({
    //     name: "Mèo",
    //     city: "HCM",
    //     birthday: "2020-02-02",
    //     rating: "Gioi"
    //   })
  };
  const handle_change = (e) => {
    const { name, value } = e.target;
      setStudent((prevStudent) => ({
        ...prevStudent,
        [name]: value,
      }));
  };
  const convertDateToYYYYMMDD = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };
  const convertDateToDDMMYYYY = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

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

  useEffect(() => {
    if (status) {
      if (status == 200) {
        toast.success(message);
        setModal(false);
      } else {
        toast.error(message);
      }
    }
  }, [status, message]);
  const [EStudent, setEStudent] = useState({
    id: "",
    name: "",
    city: "",
    birthday: "",
    rating: "",
  });
  const [studentEdit, setStudentEdit] = useState({ isEdit: false, id: "" });
  const handle_edit = (id, item) => {
    setStudentEdit({ isEdit: true, id });
    setEStudent(item);
  };
  const handle_save = (id) => {
    dispatch(
      editStudent({
        id,
        std: EStudent,
      })
    );
    setStudentEdit({ isEdit: false, id: "" });
    setEStudent({
      id: "",
      name: "",
      city: "",
      birthday: "",
      rating: "",
    })
  };
  return (
    <div>
      <Container>
        <h1>Total: {totalPages}</h1>
        <div>
          <Button color="success" onClick={toggle}>
            Add new student
          </Button>
          <Modal isOpen={modal} toggle={toggle}>
            {error && (
              <Alert color="danger">
                <ul>
                  {error.map((er, index) => (
                    <li key={index}>{er}</li>
                  ))}
                </ul>
              </Alert>
            )}
            <ModalHeader toggle={toggle}>Add new student</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="name">Họ tên</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nhập vào họ và tên"
                    type="text"
                    value={student.name}
                    onChange={handle_change}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="city">Thành phố</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Nhập vào thành phố"
                    type="text"
                    value={student.city}
                    onChange={handle_change}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="birthday">Sinh nhật</Label>
                  <Input
                    id="birthday"
                    name="birthday"
                    placeholder="nhập vào ngày tháng năm sinh"
                    type="date"
                    value={student.birthday}
                    onChange={handle_change}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="rating">xếp loại</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="select"
                    value={student.rating}
                    onChange={handle_change}
                  >
                    <option>Gioi</option>
                    <option>Kha</option>
                    <option>Tb</option>
                    <option>Yeu</option>
                  </Input>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handle_add}>
                Add new
              </Button>{" "}
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        {showMessage && (
          <Alert color={status === 200 ? "success" : "danger"}>{message}</Alert>
        )}
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên sinh viên</th>
              <th>Thành phố</th>
              <th>Sinh nhật</th>
              <th>Xếp loại</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {students &&
              students.map((item, index) => (
                <tr
                  key={index}
                  className={
                    studentEdit.isEdit && item.id === studentEdit.id
                      ? "student-item active"
                      : "student-item"
                  }
                >
                  <td>{index + 1}</td>
                  <td scope="row">
                    {studentEdit.isEdit && item.id === studentEdit.id ? (
                      <Input
                        type="text"
                        name="name"
                        value={EStudent.name}
                        onChange={(e) =>
                          setEStudent({ ...EStudent, name: e.target.value })
                        }
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td>
                    {studentEdit.isEdit && item.id === studentEdit.id ? (
                      <Input
                        type="text"
                        name="city"
                        value={EStudent.city}
                        onChange={(e) =>
                          setEStudent({ ...EStudent, city: e.target.value })
                        }
                      />
                    ) : (
                      item.city
                    )}
                  </td>
                  <td>
                    {studentEdit.isEdit && item.id === studentEdit.id ? (
                      <Input
                        type="date"
                        name="birthday"
                        value={EStudent.birthday}
                        onChange={(e) =>
                          setEStudent({ ...EStudent, birthday: e.target.value})
                        }
                      />
                    ) : (
                      item.birthday
                    )}
                  </td>
                  <td>
                    {studentEdit.isEdit && item.id === studentEdit.id ? (
                      <Input
                        id="rating"
                        name="rating"
                        type="select"
                        value={EStudent.rating}
                        onChange={(e) =>
                          setEStudent({ ...EStudent, rating: e.target.value })
                        }
                      >
                        <option>Gioi</option>
                        <option>Kha</option>
                        <option>Tb</option>
                        <option>Yeu</option>
                      </Input>
                    ) : (
                      item.rating
                    )}
                  </td>
                  <td>
                    {studentEdit.isEdit && item.id === studentEdit.id ? (
                      <Button
                        className="btn btn-success"
                        onClick={() => handle_save(item.id)}
                      >
                        Save{" "}
                      </Button>
                    ) : (
                      <>
                        <Button
                          className="btn btn-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "bạn có muốn xóa sinh viên này không?"
                              )
                            ) {
                              handle_delete(item.id);
                            }
                          }}
                        >
                          Delete{" "}
                        </Button>
                        <Button
                          className="btn btn-warning mx-2"
                          onClick={() => handle_edit(item.id,item)}
                        >
                          Edit{" "}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(totalPages)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </Container>
    </div>
  );
}
