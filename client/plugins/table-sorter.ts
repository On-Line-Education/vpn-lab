import { reactive } from "vue";

export default class TableSorter {
    protected _currentSort = "name";
    protected _currentSortDir = "asc";
    protected _data;
    public sortData;

    public currentSort() {
        return this._currentSort;
    }

    public currentSortDir() {
        return this._currentSortDir;
    }

    constructor(data) {
        this.sortData = reactive({ data });
        this._data = data;
    }

    search(search) {
        this.sortData.data = this._data.filter((a) => {
            let values = Object.values(a);
            for (let val in values) {
                if (
                    values[val]
                        .toString()
                        .trim()
                        .toLowerCase()
                        .includes(search.toString().trim().toLowerCase())
                ) {
                    return true;
                }
            }
            return false;
        });
        this.sort(this._currentSort, true);
    }

    sort(s, resort = false) {
        if (s === this._currentSort && !resort) {
            this._currentSortDir =
                this._currentSortDir === "asc" ? "desc" : "asc";
        }
        this._currentSort = s;
        this.sortData.data = this.sortData.data.sort((a, b) => {
            let modifier = 1;
            if (this._currentSortDir === "desc") modifier = -1;
            if (a[this._currentSort] < b[this._currentSort])
                return -1 * modifier;
            if (a[this._currentSort] > b[this._currentSort])
                return 1 * modifier;
            return 0;
        });
    }
}
