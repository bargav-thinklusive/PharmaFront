import ActionsCellRenderer, { NameCellRenderer, RoleCellRenderer, StatusToggleCellRenderer } from "./ActionsCellRenderer";

export const columns: any = [
  {
    headerName: "Name",
    headerClass: "table-header",
    field: "name",
    cellRenderer: NameCellRenderer,
    flex: 2,
    minWidth: 220,
    sortable: true,
    filter: true,
    autoHeight: true,
  },
  {
    headerName: "Role",
    headerClass: "table-header",
    field: "roles",
    cellRenderer: RoleCellRenderer,
    flex: 1,
    minWidth: 150,
    sortable: true,
    filter: true,
  },
  {
    headerName: "Status",
    headerClass: "table-header",
    field: "status",
    cellRenderer: StatusToggleCellRenderer,
    flex: 1,
    minWidth: 160,
    sortable: true,
    filter: true,
  },
  {
    headerName: "Actions",
    headerClass: "table-header",
    field: "actions",
    cellRenderer: ActionsCellRenderer,
    width: 100,
    sortable: false,
    filter: false,
    resizable: false,
    suppressMenu: true,
    pinned: "right",
  },
];

