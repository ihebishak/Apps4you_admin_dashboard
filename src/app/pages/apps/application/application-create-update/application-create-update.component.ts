import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icClose from "@iconify/icons-ic/twotone-close";
import icPrint from "@iconify/icons-ic/twotone-print";
import icDownload from "@iconify/icons-ic/twotone-cloud-download";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icPhone from "@iconify/icons-ic/twotone-phone";
import icPerson from "@iconify/icons-ic/twotone-person";
import icMyLocation from "@iconify/icons-ic/twotone-my-location";
import icLocationCity from "@iconify/icons-ic/twotone-location-city";
import icEditLocation from "@iconify/icons-ic/twotone-edit-location";
import { ApplicationService } from "src/app/_services/application.service";
import { Application } from "../interfaces/application.model";
import icEmail from "@iconify/icons-ic/twotone-mail";
import icSubject from "@iconify/icons-ic/twotone-subject";
import icComment from "@iconify/icons-ic/twotone-comment";
import icAssignment from "@iconify/icons-ic/twotone-assignment";
import { Decision } from "../interfaces/decision.model";

@Component({
  selector: "vex-application-create-update",
  templateUrl: "./application-create-update.component.html",
  styleUrls: ["./application-create-update.component.scss"],
})
export class ApplicationCreateUpdateComponent implements OnInit {
  form: FormGroup;
  application: Application = new Application();
  selectedDec: any;
  bb: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<ApplicationCreateUpdateComponent>,
    private fb: FormBuilder,
    private applicationService: ApplicationService
  ) {}

  ngOnInit() {
    if (this.defaults) {
      this.mode = "update";
    } else {
      this.defaults = {} as Application;
    }

    this.form = this.fb.group({
      fullName: this.defaults.fullName,
      emailClient: this.defaults.emailClient,
      subject: this.defaults.subject,
      comment: this.defaults.comment,
      status: this.defaults.status,
    });
  }

  static id = 100;

  mode: "create" | "update" = "create";

  icMoreVert = icMoreVert;
  icClose = icClose;
  icAssignment = icAssignment;
  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;
  icPerson = icPerson;
  icEmail = icEmail;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  icSubject = icSubject;
  icComment = icComment;

  Decisions: Decision[] = [
    { value: "Accepted", viewValue: "Accepted" },
    { value: "Rejected", viewValue: "Rejected" },
  ];

  save() {
    if (this.mode === "create") {
      this.createApplication();
    } else if (this.mode === "update") {
      this.updateApplication();
    }
  }

  createApplication() {
    this.application.fullName = this.form.value.fullName;
    this.application.emailClient = this.form.value.emailClient;
    this.application.subject = this.form.value.subject;
    this.application.comment = this.form.value.comment;
    this.application.status = this.form.value.status;
    this.applicationService.postApplication(this.application).subscribe(
      (res) => {
        console.log("application added sucessfully !");
      },
      (err) => {
        console.log("erreur in adding application !");
      }
    );
    this.dialogRef.close(this.application);
  }

  updateApplication() {
    const application = this.form.value;
    application.id = this.defaults.id;
    this.dialogRef.close(application);
    this.applicationService
      .updateApplication(application, application.id)
      .subscribe(
        (res) => {
          console.log("application updated sucessfully !");
        },
        (err) => {
          console.log("erreur in updating application !");
        }
      );
  }

  isCreateMode() {
    return this.mode === "create";
  }

  isUpdateMode() {
    return this.mode === "update";
  }
}
