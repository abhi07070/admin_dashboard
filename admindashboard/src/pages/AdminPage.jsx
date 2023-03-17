import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import UserData from '../components/UserData';
import Spinner from '../components/Spinner';

const customStyles = {
  overlay: {
    backgroundColor: '#17181f',
    zIndex: 9999,
  },
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    border: '2px solid #30313d',
    padding: '5%',
    width: '60%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    maxWidth: '600px',
  },
};


const AdminPage = () => {

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    age: Yup.number().required('Age is required').min(18, "'Age must be greater than 18"),
    email: Yup.string().email().required('Email is required'),
    gender: Yup.string().required('Gender is required'),
  });


  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [data, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:4000/data', { withCredentials: true })
      .then((response) => {
        setData(response.data);
        setIsLoggedIn(true);
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error);
        setShowModal(true);
      });
  }, []);

  function addUserData(ev) {
    ev.preventDefault();
    const userData = {
      name: name,
      age: Number(age),
      email: email,
      gender: gender,
    };

    validationSchema
      .validate(userData)
      .then(() => {
        axios
          .post(`http://localhost:4000/data`, userData, { withCredentials: true })
          .then((response) => {
            setData([...data, response.data]);
            setName('');
            setAge('');
            setEmail('');
            setGender('');
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  }


  function deleteUserData(_id) {
    axios
      .delete(`http://localhost:4000/data/${_id}`, { withCredentials: true })
      .then(() => {
        setData(data.filter((item) => item._id !== _id));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function updatePost(_id, name, age, email, gender) {
    const updatedData = { _id, name, age, email, gender };

    axios
      .put(`http://localhost:4000/data/${_id}`, updatedData, { withCredentials: true })
      .then((response) => {
        setData(data.map(item => item._id === _id ? response.data : item));
        setName(response.data.name);
        setAge(response.data.age);
        setEmail(response.data.email);
        setGender(response.data.gender);
        deleteUserData(response.data._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if(isLoading){
    return <Spinner/>
  }


  return (
    <>
      {isLoggedIn ? (
        <main>
          <div className="admin-details">
            <div className='form-data'>
              <form onSubmit={addUserData}>
                <input
                  type='text'
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  placeholder={'name'}
                />
                <input
                  type='number'
                  value={age}
                  onChange={(ev) => setAge(ev.target.value)}
                  placeholder={'age'}
                />
                <input
                  type='email'
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder={'email'}
                />
                <select className='gender-select' name="gender" id="gender" value={gender} onChange={(ev) => setGender(ev.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <button type='submit'>Add Info</button>
              </form>
            </div>

            <div className="user-details">
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Delete / Update</th>
                  </tr>
                </thead>
                <tbody>
                  <UserData data={data} onDelete={deleteUserData} onUpdate={updatePost} />
                </tbody>
              </table>
            </div>
          </div>
        </main>
      ) : (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          style={customStyles}
        >
          <h1>Welcome</h1>
          <p>Please Login or Register</p>
          <Link to='/login' className='modal-btn'>
            <button onClick={() => setShowModal(false)}>Login</button>
          </Link>
          <Link to='/register' className='modal-btn'>
            <button onClick={() => setShowModal(false)}>Register</button>
          </Link>

        </Modal>
      )}
    </>
  );
};
export default AdminPage;
