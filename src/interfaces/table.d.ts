interface UiTableHeading {
  name: string;
  prop: string;
  sortable: boolean;
  icon: string;
  width: string;
  align: string;
}

type UiTableSortMethod = (prop: string, direction: string) => any;
