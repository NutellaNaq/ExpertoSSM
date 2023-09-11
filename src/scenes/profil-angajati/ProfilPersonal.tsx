import { useEffect, useState } from "react";
import { getCurrentUserAngajatAPIRequest } from "../../requests/user.request";
import { ApiResponseType } from "../../utils/api.utils";

type Angajat = {
  id: string;
  last_name: string;
  first_name: string;
  badge_number: string;
  blood_type: string;
  home_adress: string;
  date_of_birth: string;
  place_of_birth: string;
  qualification: string;
  function: string;
  email: string;
  telephone: string;
  department: string;
  internal_matriculation_number: string;
  date_of_employment: string;
  drives_the_company_car: boolean;
};

function ProfilPersonal() {
  // create a new state variable called "angajat" and initialize it to an empty array and make it be of type Angajat
  const [angajat, setAngajat] = useState<Angajat>();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Make the API request
        const getUserInfo: ApiResponseType =
          await getCurrentUserAngajatAPIRequest();

        // If there is an error in the API response, handle it appropriately
        if (getUserInfo.error) {
          console.error("Error fetching user data:", getUserInfo.error);
          return;
        }

        // If the API response is successful, extract the 'data' property which should contain the array of Angajat objects
        const angajatData: Angajat = getUserInfo.angajat;

        console.log(angajatData);

        // Set the state of angajat to the array of type Angajat
        setAngajat(angajatData);
      } catch (error) {
        // Handle any errors that occurred during the API request
        console.error("Error fetching user data:", error);
        // You can choose to show an error message to the user or take other actions here
      }
    };

    getCurrentUser();

    console.log("angajat");
    console.log(angajat);
  }, []);

  return (
    <div id="profilAngajati">
      <div className="flex column align-items-center">
        <div className="centering-container">
          <div className="info-angajat-container">
            <h2 className="w-100">Informatii de baza</h2>
            <div className="grid-info">
              <h5>Nume</h5> <h4>{angajat?.last_name}</h4>
            </div>
            <div className="grid-info">
              <h5>Prenume</h5> <h4>{angajat?.first_name}</h4>
            </div>
            <div className="grid-info">
              <h5>Functia</h5> <h4>{angajat?.function}</h4>
            </div>
            <div className="grid-info">
              <h5>Legitimatie</h5> <h4>{angajat?.badge_number}</h4>
            </div>
          </div>

          <div className="info-angajat-container">
            <h2 className="w-100">Informatii de contact</h2>
            <div className="grid-info">
              <h5>Email</h5> <h4>{angajat?.email}</h4>
            </div>
            <div className="grid-info">
              <h5>Telefon</h5> <h4>{angajat?.telephone}</h4>
            </div>
          </div>

          <div className="info-angajat-container">
            <h2 className="w-100">Detalii Angajat</h2>
            <div className="grid-info">
              <h5>Grupa Sanguina</h5> <h4>{angajat?.blood_type}</h4>
            </div>
            <div className="grid-info">
              <h5>Domiciliul</h5> <h4>{angajat?.home_adress}</h4>
            </div>
            <div className="grid-info">
              <h5>Locul Nasterii</h5> <h4>{angajat?.place_of_birth}</h4>
            </div>
            <div className="grid-info">
              <h5>Calificarea</h5> <h4>{angajat?.qualification}</h4>
            </div>
            <div className="grid-info">
              <h5>Data Nasterii</h5> <h4>{angajat?.date_of_birth}</h4>
            </div>
            <div className="grid-info">
              <h5>Departamentul</h5> <h4>{angajat?.department}</h4>
            </div>
            <div className="grid-info">
              <h5>Numar Matricol Intern</h5>{" "}
              <h4>{angajat?.internal_matriculation_number}</h4>
            </div>
            <div className="grid-info">
              <h5>Data Angajarii</h5> <h4>{angajat?.date_of_employment}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilPersonal;
