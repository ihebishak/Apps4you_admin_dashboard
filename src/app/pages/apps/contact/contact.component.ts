import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Observable, of, ReplaySubject } from "rxjs";
import { Contact } from "./interfaces/contact.model";
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
import { ContactService } from "src/app/_services/contact.service";
import { ContactCreateUpdateComponent } from "./contact-create-update/contact-create-update.component";

@UntilDestroy()
@Component({
  selector: "vex-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
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
export class ContactComponent implements OnInit, AfterViewInit {
  contactList: Array<Contact>;
  dataSource: MatTableDataSource<Contact> = new MatTableDataSource();
  selectedContact: Contact;
  errorMessage: string;
  infoMessgage: string;
  contactData: any;
  contact: Contact;
  layoutCtrl = new FormControl("boxed");
  subject$: ReplaySubject<Contact[]> = new ReplaySubject<Contact[]>(1);
  data$: Observable<Contact[]> = this.subject$.asObservable();
  contacts: Contact[];

  @Input()
  columns: TableColumn<Contact>[] = [
    {
      label: "Checkbox",
      property: "Checkbox",
      type: "checkbox",
      visible: true,
    },
    { label: "Full Name", property: "Full Name", type: "text", visible: true },
    { label: "E-mail", property: "E-mail", type: "text", visible: true },
    { label: "Subject", property: "Subject", type: "text", visible: true },
    { label: "Message", property: "Message", type: "text", visible: true },
    { label: "Actions", property: "actions", type: "button", visible: true },
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  selection = new SelectionModel<Contact>(true, []);
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
    private contactService: ContactService,
    private formBuilder: FormBuilder
  ) {}

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit() {
    this.getAllContacts();
    this.searchCtrl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createContact() {
    this.dialog
      .open(ContactCreateUpdateComponent)
      .afterClosed()
      .subscribe((data) => {
        console.log(data);
        this.getAllContacts();
      });
  }

  updateContact(contact: Contact) {
    this.dialog
      .open(ContactCreateUpdateComponent, {
        data: contact,
      })
      .afterClosed()
      .subscribe((data) => {
        console.log(data);
        this.getAllContacts();
      });
  }

  deleteContact(contact: Contact) {
    this.contactService.deleteContact(contact.id).subscribe((data) => {
      console.log("contact deleted !");
      this.getAllContacts();
    });
  }

  deleteContacts(contacts: Contact[]) {
    contacts.forEach((c) => this.deleteContact(c));
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

  onLabelChange(change: MatSelectChange, row: Contact) {
    const index = this.contacts.findIndex((c) => c === row);
    this.subject$.next(this.contacts);
  }

  getAllContacts() {
    this.contactService.getAllContacts().subscribe((data) => {
      this.contactList = data;
      this.dataSource.data = data;
    });
  }
}
