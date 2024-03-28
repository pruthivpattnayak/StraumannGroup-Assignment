
import React, { useState, useEffect } from 'react';
import './App.css'
import {useNavigate} from 'react-router-dom';
// PatientHistoryGraph component definition
const PatientHistoryGraph = () => {
    const navigate = useNavigate(); // Access navigate object
    const { patientInfo, loading, error } = usePatientInfo();
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [ageFilter, setAgeFilter] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const handleSearchChange = (event) => {
      setSearchValue(event.target.value);
    };
  
    useEffect(() => {
      // Filter patients based on any search value
      const filtered = patientInfo.filter(patient =>
        calculateAge(patient.birthDate) === ageFilter &&
        (searchValue === '' ||
          patient.id.includes(searchValue) ||
          patient.name[0].given[0].toLowerCase().includes(searchValue.toLowerCase()) ||
          patient.name[0].family.toLowerCase().includes(searchValue.toLowerCase()) ||
          patient.gender.toLowerCase().includes(searchValue.toLowerCase()) ||
          patient.birthDate.includes(searchValue.toLowerCase()) ||
          patient.address[0].city.toLowerCase().includes(searchValue.toLowerCase()) ||
          patient.address[0].country.toLowerCase().includes(searchValue.toLowerCase()) ||
          patient.telecom.find(t => t.system === 'phone').value.includes(searchValue.toLowerCase())
        )
      );
      setFilteredPatients(filtered);
    }, [patientInfo, ageFilter, searchValue]);
  
  
    const calculateAge = (birthdate) => {
      const today = new Date();
      const dob = new Date(birthdate);
      let age = today.getFullYear() - dob.getFullYear();
      const month = today.getMonth() - dob.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age;
    };
    
    // Slider functionality
    const handleSliderChange = (event) => {
      setAgeFilter(parseInt(event.target.value));
    };
  
    const handleDetailsButtonClick = (id) => {
      // Redirect to the details page with the patient ID
      navigate(`/details/${id}`);
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
    <div>
        <div>
          <input type="text" placeholder="Search for anything" value={searchValue} onChange={handleSearchChange} />
        </div>
        <h3>Patient List</h3>
        <div className='mainConatiner'> 
            <div>
                <label htmlFor="ageSlider">Filter by Age:</label>
                <input type="range" id="ageSlider" min="0" max="23" value={ageFilter} onChange={handleSliderChange} />
                <span>{ageFilter}</span>
            </div>
            {ageFilter ? 
            <table>
            <thead>
                <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>BirthDate</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {filteredPatients.map(patient => (
                <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.name[0].given[0]} {patient.name[0].family}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.birthDate}</td>
                    <td>{`${patient.address[0].line}, ${patient.address[0].city}, ${patient.address[0].country}`}</td>
                    <td>{patient.telecom.find(t => t.system === 'phone').value}</td>
                    <td>
                    <button onClick={() => handleDetailsButtonClick(patient.id)}>Details</button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
        : 
        <h2>Please adjust the slider to get data</h2> }
        </div>
    </div>
    );
  };

  // Custom react hook for getting patient information
  const usePatientInfo = () => {
    const [patientInfo, setPatientInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchPatientInfo = async () => {
        try {
          setLoading(true);
          const response = await fetch('https://hapi.fhir.org/baseR4/Patient?_pretty=true');
          if (!response.ok) {
            throw new Error('Failed to fetch patient information');
          }
          const data = await response.json();
          setPatientInfo(data.entry.map(entry => entry.resource));
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      fetchPatientInfo();
  
    }, []);
  
    return { patientInfo, loading, error };
  };

  export default PatientHistoryGraph;