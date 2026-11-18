
import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  FileText,
  Clock,
  Bell,
  UserCircle
} from "lucide-react";

import "./StaffDashboard.css";

const modules = [
  { name: "My Profile", icon: UserCircle, path: "/staff-profile" },
  { name: "Student Management", icon: Users, path: "/students" },
  { name: "Mark Attendance", icon: CalendarCheck, path: "/attendance" },
  { name: "Attendance Reports", icon: FileText, path: "/reports" },
  { name: "Timetable", icon: Clock, path: "/timetable" },
  { name: "Notices", icon: Bell, path: "/notices" }
];

function StaffDashboard() {
  const navigate = useNavigate();

  return (
    <div className="staff-dashboard-page">
      <div className="school-heading">
        <h2>Staff Dashboard</h2>
        <p>Welcome to Swami Dayanand Public School</p>
      </div>

      <div className="module-grid">
        {modules.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              className="module-card"
              key={item.name}
              onClick={() => navigate(item.path)}
            >
              <Icon size={58} strokeWidth={1.8} />
              <p>{item.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StaffDashboard;
