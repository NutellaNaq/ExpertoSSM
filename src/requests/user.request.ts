import { ApiResponse, axiosInstance } from "../utils/api.utils";

type LoginRequestType = {
  email: string;
  password: string;
};

type AngajatData = {
  nume: string;
  prenume: string;
  legitimatie: string;
  grupaSanguina: string;
  domiciliu: string;
  dataNasterii: string;
  loculNasterii: string;
  calificarea: string;
  functia: string;
  email: string;
  telefon: string;
  departamentul: string;
  numarMatricolIntern: string;
  dataAngajarii: string;
  conduceMasinaCompaniei: boolean;
};

type UserAngajat = {
  email?: string;
  telefon?: string;
  role: string;
};

type FisaSSMAngajat = {
  angajati: string[];
};

export const logoutAPIRequest = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return ApiResponse.error("No token found");
    }
    //make token_id that is equal to the substring of token that starts from the start and ends at the "|"

    const tokenId = token.substring(0, token.indexOf("|"));

    //make tokenData that equals the rest of the token string after the "|"
    const tokenData = token.substring(token.indexOf("|") + 1);

    const result = await axiosInstance.post("/user/logout", {
      token: tokenData,
      tokenId: tokenId,
    });
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const createAngajatAPIRequest = async (AngajatData: AngajatData) => {
  try {
    const result = await axiosInstance.post(
      "/angajati/createAngajat",
      AngajatData
    );
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const loginAPIRequest = async (LoginData: LoginRequestType) => {
  try {
    const result = await axiosInstance.post("/user/login", LoginData);
    const { token } = result.data;
    localStorage.setItem("token", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log(localStorage.getItem("token"));
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getAllAngajatiAPIRequest = async () => {
  try {
    const result = await axiosInstance.get("/angajati/getAllAngajati");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const deleteAngajatAPIRequest = async (id: string) => {
  try {
    const result = await axiosInstance.post("/angajati/deleteAngajat", { id });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getUsersPermissionsAPIRequest = async () => {
  try {
    const result = await axiosInstance.get("/user/getUserPermissions");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getUserRolesAPIRequest = async () => {
  try {
    const result = await axiosInstance.get("/user/getUserRoles");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const updateAngajatAPIRequest = async (AngajatData: AngajatData) => {
  try {
    const result = await axiosInstance.patch(
      "/angajati/updateAngajat",
      AngajatData
    );
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getFisaSSMByIdAPIRequest = async (id: number) => {
  try {
    const result = await axiosInstance.get(`/fiseSSM/show/${id}`);
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getCurrentUserAPIRequest = async () => {
  try {
    const result = await axiosInstance.get("/user/currentUser");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getCurrentUserAngajatAPIRequest = async () => {
  try {
    const result = await axiosInstance.get("/angajati/getCurrentAngajat");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const registerUserAngajatAPIRequest = async (
  UserAngajat: UserAngajat
) => {
  try {
    const result = await axiosInstance.post(
      "/user/registerUserAngajat",
      UserAngajat
    );
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getAllAngajatiStatusApiRequest = async () => {
  try {
    const result = await axiosInstance.get("/angajati/getAllAngajatiStatus");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getAllTeamsStatusApiRequest = async () => {
  try {
    const result = await axiosInstance.get("/angajati/getAllTeamsStatus");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

//Request of getTeamMembersSSMStatus

export const getTeamMembersSSMStatusApiRequest = async (teamIds: number) => {
  try {
    const result = await axiosInstance.get(
      `/angajati/getTeamMembersSSMStatus/`,
      {
        params: {
          teamId: teamIds,
        },
      }
    );
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getListOfTeamsApiRequest = async () => {
  try {
    const result = await axiosInstance.get("/team/getListOfTeams");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getDetailsAboutTeam = async (teamId: number) => {
  try {
    const result = await axiosInstance.get(`/team/getDetailsAboutTeam/`, {
      params: {
        team_id: teamId,
      },
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const addMemberToTeam = async (teamId: number, angajatId: number) => {
  try {
    const result = await axiosInstance.post(`/team/addMember`, {
      team_id: teamId,
      angajat_id: angajatId,
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};
