import { useState } from "react";
import ListTeams from "./list-teams/ListTeams";
import Organigramme from "./organigram/Organigramme";
import TitlePage from "../../components/Title-Page";

function CompaniaMea() {
  const [teamList, setTeamList] = useState<boolean>();

  const handleSetTeamList = () => {
    setTeamList(!teamList);
  };

  return (
    <div className="companiaMea">
      <TitlePage mainTitle={"COMPANIA MEA"} />
      {teamList ? (
        <ListTeams handleSetTeamList={handleSetTeamList} />
      ) : (
        <Organigramme handleSetTeamList={handleSetTeamList} />
      )}
    </div>
  );
}

export default CompaniaMea;
