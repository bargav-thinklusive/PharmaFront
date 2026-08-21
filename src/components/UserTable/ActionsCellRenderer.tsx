import { FiTrash2 } from "react-icons/fi";
import CustomSelect from "../shared/CustomSelect";

export const NameCellRenderer = (params: any) => {
  const name = params.data?.name || "Unnamed User";
  const email = params.data?.email || "";

  const getInitials = (n: string) => {
    return n
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3 py-1.5 h-full">
      <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shadow-xs shrink-0 font-display">
        {getInitials(name)}
      </div>
      <div className="leading-tight truncate">
        <div className="font-semibold text-text-main text-sm truncate font-sans">{name}</div>
        <div className="text-xs text-text-secondary truncate font-sans">{email}</div>
      </div>
    </div>
  );
};

export const RoleCellRenderer = (params: any) => {
  const primaryRole = params.data?.roles?.[0] || "subscriber";

  return (
    <div className="flex items-center h-full w-full">
      <CustomSelect
        value={primaryRole}
        onChange={(val) => params.context.onUpdateRole(params.data._id, val)}
        options={[
          { label: "Admin", value: "admin" },
          { label: "Editor", value: "editor" },
          { label: "Subscriber", value: "subscriber" },
        ]}
        className="py-1 px-2.5 text-xs font-semibold capitalize font-sans"
      />
    </div>
  );
};

export const StatusToggleCellRenderer = (params: any) => {
  const rawStatus = params.data?.status;
  const rawIsActive = params.data?.isActive ?? params.data?.is_active;

  const isActive = rawStatus
    ? rawStatus.toLowerCase() === "active"
    : rawIsActive !== undefined
    ? Boolean(rawIsActive)
    : true;

  return (
    <div className="flex items-center h-full">
      <button
        type="button"
        onClick={() => params.context.onToggleStatus(params.data._id, isActive)}
        className={`group relative inline-flex items-center h-7 rounded-full w-24 px-1 transition-all duration-200 focus:outline-none cursor-pointer border select-none ${
          isActive
            ? "bg-emerald-50 border-emerald-300 hover:border-emerald-400 text-emerald-700"
            : "bg-slate-100 border-slate-300 hover:border-slate-400 text-slate-500"
        }`}
        title={`Click to ${isActive ? "deactivate" : "activate"} user`}
      >
        <span
          className={`inline-block w-5 h-5 rounded-full transition-transform duration-200 ease-in-out shadow-xs ${
            isActive
              ? "translate-x-[62px] bg-emerald-600"
              : "translate-x-0 bg-slate-400"
          }`}
        />
        <span
          className={`absolute text-[11px] font-bold font-sans tracking-wide uppercase transition-opacity ${
            isActive ? "left-2.5 text-emerald-700" : "right-2.5 text-slate-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </button>
    </div>
  );
};

const ActionsCellRenderer = (params: any) => {
  return (
    <div className="flex items-center justify-end h-full w-full pr-2">
      <button
        onClick={() => params.context.onDeleteUser(params.data)}
        className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        title="Delete User"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ActionsCellRenderer;


