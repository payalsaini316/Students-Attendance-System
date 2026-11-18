
import {
  Users,
  CalendarCheck,
  FileText,
  Clock,
  Bell,
  UserCircle
} from "lucide-react";

const modules = [
  { name: "My Profile", icon: UserCircle },
  { name: "Student Management", icon: Users },
  { name: "Mark Attendance", icon: CalendarCheck },
  { name: "Attendance Reports", icon: FileText },
  { name: "Timetable", icon: Clock },
  { name: "Notices", icon: Bell }
];

function StaffDashboard() {
  return (
    <>
      <div className="school-heading">
        <h2>Staff Dashboard</h2>
        <p>Welcome to Swami Dayanand Public School</p>
      </div>

      <div className="module-grid">
        {modules.map((item) => {
          const Icon = item.icon;

          return (
            <div className="module-card" key={item.name}>
              <Icon size={58} strokeWidth={1.8} />
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default StaffDashboard;
