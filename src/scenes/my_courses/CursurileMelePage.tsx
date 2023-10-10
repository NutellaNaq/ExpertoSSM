import TitlePage from "../../components/Title-Page";
import EmployeeCoursesPage from "./EmployeeCoursesPage";
import MyCourses from "../../components/MyCourses";

type props = {
  userPermissions: string[];
};

function CursurileMelePage({ userPermissions }: props) {
  const isNotAngajat = userPermissions.includes("view-profil-angajati");

  return (
    <>
      <TitlePage mainTitle={"CURSURILE MELE"} />

      {isNotAngajat ? <EmployeeCoursesPage /> : <MyCourses />}
    </>
  );
}

export default CursurileMelePage;
