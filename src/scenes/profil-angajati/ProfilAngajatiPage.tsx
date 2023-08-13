import ProfilAngajati from "./ProfilAngajati";
import ProfilPersonal from "./ProfilPersonal";

type props = {
  userPermissions: string[];
};

function ProfilAngajatPage({ userPermissions }: props) {
  const isNotAngajat = userPermissions.includes("view-profil-angajati");

  return (
    <>
      {isNotAngajat ? (
        <ProfilAngajati userPermissions={userPermissions} />
      ) : (
        <ProfilPersonal />
      )}
    </>
  );
}

export default ProfilAngajatPage;
