import { FiTrash2 } from "react-icons/fi";

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
      <select
        value={primaryRole}
        onChange={(e) => params.context.onUpdateRole(params.data._id, e.target.value)}
        className="bg-[#F8FAFC] border border-border-main rounded-lg px-2.5 py-1.5 text-xs font-semibold text-text-main hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all cursor-pointer capitalize font-sans"
      >
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="subscriber">Subscriber</option>
      </select>
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

