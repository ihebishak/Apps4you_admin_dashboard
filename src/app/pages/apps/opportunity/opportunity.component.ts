import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Observable, of, ReplaySubject } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { TableColumn } from "../../../../@vex/interfaces/table-column.interface";
import {
  aioTableData,
  aioTableLabels,
} from "../../../../static-data/aio-table-data";
import icEdit from "@iconify/icons-ic/twotone-edit";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icSearch from "@iconify/icons-ic/twotone-search";
import icAdd from "@iconify/icons-ic/twotone-add";
import icFilterList from "@iconify/icons-ic/twotone-filter-list";
import { SelectionModel } from "@angular/cdk/collections";
import icMoreHoriz from "@iconify/icons-ic/twotone-more-horiz";
import icFolder from "@iconify/icons-ic/twotone-folder";
import { fadeInUp400ms } from "../../../../@vex/animations/fade-in-up.animation";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from "@angular/material/form-field";
import { stagger40ms } from "../../../../@vex/animations/stagger.animation";
import { FormBuilder, FormControl } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatSelectChange } from "@angular/material/select";
import icPhone from "@iconify/icons-ic/twotone-phone";
import icMail from "@iconify/icons-ic/twotone-mail";
import icMap from "@iconify/icons-ic/twotone-map";
import { OpportunityService } from "src/app/_services/opportunity.service";
import { Opportunity } from "./interfaces/opportunity.model";
import { OpportunityCreateUpdateComponent } from "./opportunity-create-update/opportunity-create-update.component";

@UntilDestroy()
@Component({
  selector: "opportunity-table",
  templateUrl: "./opportunity.component.html",
  styleUrls: ["./opportunity.component.scss"],
  animations: [fadeInUp400ms, stagger40ms],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: "standard",
      } as MatFormFieldDefaultOptions,
    },
  ],
})
export class OpportunityComponent implements OnInit, AfterViewInit {
  opportunityList: Array<Opportunity>;
  dataSource: MatTableDataSource<Opportunity> = new MatTableDataSource();
  selectedOpportunity: Opportunity;
  errorMessage: string;
  infoMessgage: string;
  opportunityData: any;
  opportunity: Opportunity;
  layoutCtrl = new FormControl("boxed");
  subject$: ReplaySubject<Opportunity[]> = new ReplaySubject<Opportunity[]>(1);
  data$: Observable<Opportunity[]> = this.subject$.asObservable();
  opportunities: Opportunity[];

  @Input()
  columns: TableColumn<Opportunity>[] = [
    {
      label: "Checkbox",
      property: "Checkbox",
      type: "checkbox",
      visible: true,
    },
    { label: "Title", property: "Title", type: "text", visible: true },
    { label: "Date", property: "Date", type: "text", visible: true },
    { label: "Location", property: "Location", type: "text", visible: true },
    {
      label: "Short Description",
      property: "Short Description",
      type: "text",
      visible: true,
    },
    {
      label: "Description",
      property: "Description",
      type: "text",
      visible: true,
    },
    {
      label: "Requirements",
      property: "Requirements",
      type: "text",
      visible: true,
    },
    {
      label: "Technologies",
      property: "Technologies",
      type: "text",
      visible: true,
    },
    {
      label: "Image Location",
      property: "Image Location",
      type: "text",
      visible: true,
    },
    { label: "Actions", property: "actions", type: "button", visible: true },
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  selection = new SelectionModel<Opportunity>(true, []);
  searchCtrl = new FormControl();

  labels = aioTableLabels;
  icPhone = icPhone;
  icMail = icMail;
  icMap = icMap;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icFolder = icFolder;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private opportunityService: OpportunityService,
    private formBuilder: FormBuilder
  ) {}

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit() {
    this.getAllOpportunities();
    this.searchCtrl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createOpportunity() {
    this.dialog
      .open(OpportunityCreateUpdateComponent)
      .afterClosed()
      .subscribe((data) => {
        console.log(data);
        this.getAllOpportunities();
      });
  }

  updateOpportunity(opportunity: Opportunity) {
    this.dialog
      .open(OpportunityCreateUpdateComponent, {
        data: opportunity,
      })
      .afterClosed()
      .subscribe((data) => {
        console.log(data);
        this.getAllOpportunities();
      });
  }

  deleteOpportunity(opportunity: Opportunity) {
    this.opportunityService
      .deleteOpportunity(opportunity.id)
      .subscribe((data) => {
        console.log("opportunity deleted !");
        this.getAllOpportunities();
      });
  }

  deleteOpportunities(customers: Opportunity[]) {
    customers.forEach((c) => this.deleteOpportunity(c));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Opportunity) {
    const index = this.opportunities.findIndex((c) => c === row);
    this.subject$.next(this.opportunities);
  }

  getAllOpportunities() {
    this.opportunityService.getAllOpportunities().subscribe((data) => {
      this.opportunityList = data;
      this.dataSource.data = data;
    });
  }
}
