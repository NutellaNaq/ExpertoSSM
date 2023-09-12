import SideMenu from "./global/SideMenu";
import Dashboard from "./dashboard/Dashboard";
import "../DashboardStyle.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import ProfilAngajati from "./profil-angajati/ProfilAngajati";
import { axiosInstance } from "../utils/api.utils";
import { getCurrentUserAPIRequest } from "../requests/user.request";
import EchipaMea from "./echipa-mea/EchipaMea";
import TopMenu from "./global/TopMenu";
import ProfilAngajatPage from "./profil-angajati/ProfilAngajatiPage";
import CompaniaMea from "./compania-mea/CompaniaMea";

function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userPermissions, setUserPermissions] = useState([] as string[]);
  const [selectieMeniu, setSelectieMeniu] = useState("dashboard");

  const handleSetSelectieMeniu = (selectie: string) => {
    setSelectieMeniu(selectie);
  };

  const getCurrentUser = async () => {
    const getCurrentUserInfo = await getCurrentUserAPIRequest();

    if (getCurrentUserInfo.error) {
      //remove the token from local storage
      localStorage.removeItem("token");
      navigate("/Login");
    }

    //get from the array getCurrentUserInfo.user.all_permissions only the slug of each permission

    const userPermissionsSlugs = getCurrentUserInfo.user.all_permissions.map(
      (permission: any) => {
        return permission.slug;
      }
    );

    console.log(userPermissionsSlugs);

    setUserPermissions(userPermissionsSlugs);

    return Object.values(getCurrentUserInfo.user.all_permissions);
  };

  useEffect(() => {
    if (!token) {
      navigate("/Login");
      return () => {};
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    getCurrentUser();

    // getUserRoles();

    // getUserPermissions();
    navigate("/Courses");
  }, []);

  const handleSelectieMeniu = (selectie: string) => {
    if (selectie) {
      handleSetSelectieMeniu(selectie);
    }
  };

  return (
    <>
      <SideMenu
        handleSelectieMeniu={handleSelectieMeniu}
        selectieMeniu={selectieMeniu}
        userPermissions={userPermissions}
      />
      <div id="dashboard-page" className="dashboard-page">
        <TopMenu />
        {selectieMeniu === "profilAngajati" && (
          <ProfilAngajatPage userPermissions={userPermissions} />
        )}
        {selectieMeniu === "dashboard" && <Dashboard />}
        {selectieMeniu === "echipaMea" && <EchipaMea />}
        {selectieMeniu === "companiaMea" && <CompaniaMea />}
      </div>
    </>
  );
}

export default DashboardPage;
