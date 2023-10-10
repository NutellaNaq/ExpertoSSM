import { ApiResponse, axiosInstance } from "../utils/api.utils";

type LoginRequestType = {
  emailOrTelephone: string;
  password: string;
};

type PDFData = {
  course_id: string;
  employee_id: string;
};

type AngajatData = {
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

type UserAngajat = {
  email?: string;
  telephone?: string;
  role: string;
};

type AngajatiToAdd = {
  id: number;
  name: string;
};

type EchipaToAdd = {
  name: string;
  parent_team: number;
  employees: AngajatiToAdd[];
  leaders: AngajatiToAdd[];
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

export const loginWithTokenAPIRequest = async (tokenEmail: string) => {
  try {
    const result = await axiosInstance.post("/user/loginWithToken", {
      token: tokenEmail,
    });
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

export const getPDFFileAPIRequest = async (PDFData: PDFData) => {
  try {
    const result = await axiosInstance.post(
      "/courses/generatePDFCourse",
      {
        course_id: PDFData.course_id,
        employee_id: PDFData.employee_id.toString(),
      },
      { responseType: "blob" }
    );
    return ApiResponse.success(result);
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

export const getSelfEmployeeStatusAPIRequest = async () => {
  try {
    const result = await axiosInstance.get("/angajati/getSelfEmployeeStatus");
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

export const getAllTeamsApiRequest = async () => {
  try {
    const result = await axiosInstance.get("/team/getAllTeams");
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

export const deleteMemberFromTeam = async (
  teamId: number,
  angajatId: number
) => {
  try {
    const result = await axiosInstance.post(`/team/deleteMember`, {
      team_id: teamId,
      angajat_id: angajatId,
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const addTeamLeader = async (teamId: number, angajatId: number) => {
  try {
    const result = await axiosInstance.post(`/team/addTeamLeader`, {
      team_id: teamId,
      angajat_id: angajatId,
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const deleteTeamLeader = async (teamId: number, angajatId: number) => {
  try {
    const result = await axiosInstance.post(`/team/deleteTeamLeader`, {
      team_id: teamId,
      angajat_id: angajatId,
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getAllTeamLeadersApiRequest = async () => {
  try {
    const result = await axiosInstance.get("/angajati/getAllTeamLeaders");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const getAllMembersAndTeamLeadersApiRequest = async () => {
  try {
    const result = await axiosInstance.get("/team/getAllMembersAndTeamLeaders");
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const createTeamApiRequest = async (values: EchipaToAdd) => {
  try {
    const result = await axiosInstance.post("/team/store", {
      name: values.name,
      parent_team: values.parent_team,
      employees: values.employees,
      leaders: values.leaders,
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const recoverPasswordApiRequest = async (emailOrTelephone: string) => {
  try {
    const result = await axiosInstance.post("/user/sendVerificationCode", {
      emailOrTelephone: emailOrTelephone,
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const changePasswordGeneratedApiRequest = async (code: string) => {
  try {
    const result = await axiosInstance.post("/user/changePasswordGenerated", {
      code: code,
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const checkIfCodeCourseIsValidApiRequest = async (code: string) => {
  try {
    const result = await axiosInstance.post(
      "/courses/checkIfCodeCourseIsValid",
      {
        code: code,
      }
    );
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const adminCourseCompletedApiRequest = async (
  employeeId: string,
  courseId: string
) => {
  try {
    const result = await axiosInstance.post("/courses/adminCourseComplete", {
      course_id: courseId,
      employee_id: employeeId.toString(),
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};

export const courseLinksApiRequest = async (ids: string[]) => {
  try {
    const result = await axiosInstance.post("/courses/getCourseLinks", {
      ids: ids,
    });
    return ApiResponse.success(result.data);
  } catch (error) {
    return ApiResponse.error(error);
  }
};
