import React, { useEffect, useState } from "react";
import {
  createTeamApiRequest,
  getAllMembersAndTeamLeadersApiRequest,
  getAllTeamsApiRequest,
} from "../../../requests/user.request";
import { Tree, TreeNode } from "react-organizational-chart";
import { Autocomplete, TextField } from "@mui/material";

type Teams = {
  id: number;
  name: string;
  parent_team: number | null;
  children?: Teams[];
};

type AngajatiToAdd = {
  id: number;
  name: string;
};

type EchipaToAdd = {
  name: string;
  parent_team: number;
  angajati: AngajatiToAdd[];
  leaders: AngajatiToAdd[];
};

const INITIAL_VALUE: EchipaToAdd = {
  name: "",
  parent_team: 0,
  angajati: [],
  leaders: [],
};

type props = {
  handleSetTeamList: () => void;
};

const Organigramme = ({ handleSetTeamList }: props) => {
  const [teams, setTeams] = useState([] as Teams[]);

  const [menuVisible, setMenuVisible] = useState(false);

  const [angajati, setAngajati] = useState([] as AngajatiToAdd[]);
  const [angajatiNume, setAngajatiNume] = useState([] as string[]);

  const [leaders, setLeaders] = useState([] as AngajatiToAdd[]);
  const [leadersNume, setLeadersNume] = useState([] as string[]);

  const [dateEchipaAdaugata, setDateEchipaAdaugata] =
    useState<EchipaToAdd>(INITIAL_VALUE);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleGetAllTeams = async () => {
    try {
      const teamsResponse = await getAllTeamsApiRequest();
      const teamsData: Teams[] = teamsResponse.team.map((team: any) => ({
        ...team,
        parent_team:
          team.parent_team !== null ? parseInt(team.parent_team, 10) : null,
      }));

      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleGetAllAngajati = async () => {
    try {
      const angajatiResponse = await getAllMembersAndTeamLeadersApiRequest();

      const responseAngajati = Object.values(angajatiResponse.angajati);
      const responseLeaders = Object.values(angajatiResponse.teamLeaders);

      console.log(responseAngajati);

      const leadersData: AngajatiToAdd[] = responseLeaders.map(
        (leader: any) => ({
          id: leader.id,
          name: leader.id + " - " + leader.nume + " " + leader.prenume,
        })
      );

      const angajatiData: AngajatiToAdd[] = responseAngajati.map(
        (angajat: any) => ({
          id: angajat.id,
          name: angajat.id + " - " + angajat.nume + " " + angajat.prenume,
        })
      );

      console.log(angajatiData);

      setLeaders(leadersData);
      setAngajati(angajatiData);
    } catch (error) {
      console.error("Error fetching angajati:", error);
    }
  };

  useEffect(() => {
    handleGetAllTeams();
    handleGetAllAngajati();
  }, []);

  useEffect(() => {
    const angajatiNumeData: string[] = angajati.map((angajat) => angajat.name);
    const leadersNumeData: string[] = leaders.map((leader) => leader.name);
    setAngajatiNume(angajatiNumeData);
    setLeadersNume(leadersNumeData);
    console.log(angajati);
  }, [angajati]);

  useEffect(() => {
    console.log(dateEchipaAdaugata);
  }, [dateEchipaAdaugata]);

  const buildTree = (
    items: Teams[],
    parentId: number | null = null
  ): Teams[] => {
    const tree: Teams[] = [];

    for (const item of items) {
      if (item.parent_team === parentId) {
        const children = buildTree(items, item.id);
        tree.push({
          ...item,
          children: children.length > 0 ? children : undefined,
        });
      }
    }

    return tree;
  };

  const ChartTree: React.FC = () => {
    const treeData: Teams[] = buildTree(teams);

    const renderTreeNodes = (nodes: Teams[]): React.ReactNode => {
      return nodes.map((node) => (
        <TreeNode key={node.id} label={<div>{node.name}</div>}>
          {node.children && renderTreeNodes(node.children)}
        </TreeNode>
      ));
    };

    return (
      <Tree label={<div>Conducerea</div>}>{renderTreeNodes(treeData)}</Tree>
    );
  };

  const handleCreateTeam = async () => {
    if (dateEchipaAdaugata.name === "") {
      alert("Numele echipei trebuie completat!");
      return;
    }

    try {
      const response = await createTeamApiRequest(dateEchipaAdaugata);

      console.log(response);
    } catch (error) {
      console.error("Error creating team:", error);
    }

    setMenuVisible(false);
    setDateEchipaAdaugata(INITIAL_VALUE);
    handleGetAllTeams();
  };

  return (
    <div id="organigramme">
      <div className="chart-buttons">
        <button className="button-style-1" onClick={toggleMenu}>
          ADAUGA ECHIPA
        </button>
        <button className="button-style-1" onClick={handleSetTeamList}>
          LISTA ECHIPE
        </button>
      </div>
      <div className={`menu ${menuVisible ? "active" : ""}`}>
        <div className="flex column">
          <label>Nume Echipa</label>
          <input
            type="text"
            placeholder="Numele Echipei"
            value={dateEchipaAdaugata.name}
            onChange={(e) =>
              setDateEchipaAdaugata({
                ...dateEchipaAdaugata,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className="flex column" style={{ margin: "1rem 0" }}>
          <label>Echipa Parinte</label>
          <select
            value={dateEchipaAdaugata.parent_team}
            onChange={(e) =>
              setDateEchipaAdaugata({
                ...dateEchipaAdaugata,
                parent_team: parseInt(e.target.value, 10),
              })
            }
          >
            <option value={0}>Fara Echipa Parinte</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex column">
          <label>Angajati</label>
          <Autocomplete
            multiple
            id="tags-standard"
            options={angajatiNume}
            value={dateEchipaAdaugata.angajati.map((angajat) => angajat.name)}
            onChange={(_event, newValue) => {
              setDateEchipaAdaugata({
                ...dateEchipaAdaugata,
                angajati: angajati.filter((angajat) =>
                  newValue.includes(angajat.name)
                ),
              });
            }} // Directly pass the selected values
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Adaugati angajati"
                placeholder="Membrii echipei"
              />
            )}
          />
        </div>
        <div className="flex column">
          <label>Team Leaders</label>
          <Autocomplete
            multiple
            id="tags-standard"
            options={leadersNume}
            value={dateEchipaAdaugata.leaders.map((leader) => leader.name)}
            onChange={(_event, newValue) => {
              setDateEchipaAdaugata({
                ...dateEchipaAdaugata,
                leaders: leaders.filter((leader) =>
                  newValue.includes(leader.name)
                ),
              });
            }}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Adaugati angajati"
                placeholder="Membrii echipei"
              />
            )}
          />
        </div>
        <div className="flex space-between" style={{ margin: "1rem 0" }}>
          <button className="button-style-2" onClick={toggleMenu}>
            ANULEAZA
          </button>
          <button className="green-button" onClick={handleCreateTeam}>
            CREAZA ECHIPA
          </button>
        </div>
      </div>
      <div id="chart-teams">
        <ChartTree />
      </div>
    </div>
  );
};

export default Organigramme;
