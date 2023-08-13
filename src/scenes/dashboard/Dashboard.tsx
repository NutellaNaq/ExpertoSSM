import MiddleSection from "../../components/MiddleSection";
import BottomSection from "../../components/BottomSection";
import style from "./PageDashboardStyle.module.css";

function Dashboard() {
  return (
    <div className={style.dashboard} id="dashboard">
      <MiddleSection />
      <BottomSection />
    </div>
  );
}

export default Dashboard;
