import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

//PatientDetails component to display details of a selected patient
const PatientDetails = () => {
    const { id } = useParams(); // Access route parameter
    const [patient, setPatient] = useState(null);
  
    useEffect(() => {
      // Fetch details for the selected patient using the ID from the URL params
      const fetchPatientDetails = async () => {
        try {
          const response = await fetch(`https://hapi.fhir.org/baseR4/Patient/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch patient details');
          }
          const data = await response.json();
          setPatient(data);
        } catch (error) {
          console.error('Error fetching patient details:', error);
        }
      };
  
      fetchPatientDetails();
    }, [id]);
  
    if (!patient) return <div>Loading...</div>;
  
    return (
      <div>
        <h2>Patient Details</h2>
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{patient.name[0].given[0]} {patient.name[0].family}</td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>{patient.gender}</td>
            </tr>
            <tr>
              <td>BirthDate:</td>
              <td>{patient.birthDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  export default PatientDetails;