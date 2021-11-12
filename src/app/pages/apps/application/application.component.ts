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
import icDone from "@iconify/icons-ic/twotone-done";
import { Application } from "./interfaces/application.model";
import { ApplicationService } from "src/app/_services/application.service";
import { ApplicationCreateUpdateComponent } from "./application-create-update/application-create-update.component";

@UntilDestroy()
@Component({
  selector: "application-table",
  templateUrl: "./application.component.html",
  styleUrls: ["./application.component.scss"],
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
export class ApplicationComponent implements OnInit, AfterViewInit {
  applicationList: Array<Application>;
  dataSource: MatTableDataSource<Application> = new MatTableDataSource();
  selectedApplication: Application;
  errorMessage: string;
  infoMessgage: string;
  applicationData: any;
  application: Application;
  layoutCtrl = new FormControl("boxed");
  subject$: ReplaySubject<Application[]> = new ReplaySubject<Application[]>(1);
  data$: Observable<Application[]> = this.subject$.asObservable();
  applications: Application[];

  @Input()
  columns: TableColumn<Application>[] = [
    {
      label: "Checkbox",
      property: "Checkbox",
      type: "checkbox",
      visible: true,
    },
    { label: "Full Name", property: "Full Name", type: "text", visible: true },
    { label: "E-mail", property: "E-mail", type: "text", visible: true },
    { label: "Subject", property: "Subject", type: "text", visible: true },
    { label: "Comment", property: "Comment", type: "text", visible: true },
    { label: "Status", property: "Status", type: "text", visible: true },
    { label: "Actions", property: "actions", type: "button", visible: true },
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  selection = new SelectionModel<Application>(true, []);
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
  icDone = icDone;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private applicationService: ApplicationService,
    private formBuilder: FormBuilder
  ) {}

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit() {
    this.getAllApplications();
    this.searchCtrl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createApplication() {
    this.dialog
      .open(ApplicationCreateUpdateComponent)
      .afterClosed()
      .subscribe((data) => {
        console.log(data);
        this.getAllApplications();
      });
  }

  updateApplication(application: Application) {
    this.dialog
      .open(ApplicationCreateUpdateComponent, {
        data: application,
      })
      .afterClosed()
      .subscribe((data) => {
        console.log(data);
        this.getAllApplications();
      });
  }

  deleteApplication(application: Application) {
    this.applicationService
      .deleteApplication(application.id)
      .subscribe((data) => {
        console.log("application deleted !");
        this.getAllApplications();
      });
  }

  deleteApplications(applications: Application[]) {
    /**
     * Here we are updating our local array.
     * You would probably make an HTTP request here.
     */
    applications.forEach((c) => this.deleteApplication(c));
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: Application) {
    const index = this.applications.findIndex((c) => c === row);
    this.subject$.next(this.applications);
  }

  getAllApplications() {
    this.applicationService.getAllApplications().subscribe((data) => {
      this.applicationList = data;
      this.dataSource.data = data;
    });
  }
}
