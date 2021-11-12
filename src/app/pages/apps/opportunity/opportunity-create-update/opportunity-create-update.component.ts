import icImage from "@iconify/icons-ic/twotone-image";
import icDescription from "@iconify/icons-ic/twotone-description";
import icDateRange from "@iconify/icons-ic/twotone-date-range";
import icSubject from "@iconify/icons-ic/twotone-subject";
import icComment from "@iconify/icons-ic/twotone-comment";
import icTitle from "@iconify/icons-ic/twotone-title";
import icLocationOn from "@iconify/icons-ic/twotone-location-on";
import icPlaylistAddCheck from "@iconify/icons-ic/twotone-playlist-add-check";
import icLaptop from "@iconify/icons-ic/twotone-laptop";
import { OpportunityService } from "../../../../_services/opportunity.service";
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
import { Opportunity } from "../interfaces/opportunity.model";

@Component({
  selector: "vex-opportunity-create-update",
  templateUrl: "./opportunity-create-update.component.html",
  styleUrls: ["./opportunity-create-update.component.scss"],
})
export class OpportunityCreateUpdateComponent implements OnInit {
  form: FormGroup;
  opportunity: Opportunity = new Opportunity();

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<OpportunityCreateUpdateComponent>,
    private fb: FormBuilder,
    private opportunityService: OpportunityService
  ) {}

  ngOnInit() {
    if (this.defaults) {
      this.mode = "update";
    } else {
      this.defaults = {} as Opportunity;
    }

    this.form = this.fb.group({
      title: this.defaults.title,
      date: this.defaults.date,
      location: this.defaults.location,
      sh_description: this.defaults.sh_description,
      description: this.defaults.description,
      requirements: this.defaults.requirements,
      technologies: this.defaults.technologies,
      img_location: this.defaults.img_location,
    });
  }

  static id = 100;

  mode: "create" | "update" = "create";

  icMoreVert = icMoreVert;
  icClose = icClose;
  icTitle = icTitle;
  icDateRange = icDateRange;
  icLocationOn = icLocationOn;
  icDescription = icDescription;
  icPlaylistAddCheck = icPlaylistAddCheck;
  icLaptop = icLaptop;
  icImage = icImage;
  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;
  icPerson = icPerson;
  icMyLocation = icMyLocation;
  icLocationCity = icLocationCity;
  icEditLocation = icEditLocation;
  icPhone = icPhone;
  icSubject = icSubject;
  icComment = icComment;

  save() {
    if (this.mode === "create") {
      this.createOpportunity();
    } else if (this.mode === "update") {
      this.updateOpportunity();
    }
  }

  createOpportunity() {
    this.opportunity.title = this.form.value.title;
    this.opportunity.date = this.form.value.date;
    this.opportunity.location = this.form.value.location;
    this.opportunity.sh_description = this.form.value.sh_description;
    this.opportunity.description = this.form.value.description;
    this.opportunity.requirements = this.form.value.requirements;
    this.opportunity.technologies = this.form.value.technologies;
    this.opportunity.img_location = this.form.value.img_location;
    this.opportunityService.postOpportunity(this.opportunity).subscribe(
      (res) => {
        console.log("opportunity added sucessfully !");
      },
      (err) => {
        console.log("erreur in adding opportunity !");
      }
    );

    this.dialogRef.close(this.opportunity);
  }

  updateOpportunity() {
    const opportunity = this.form.value;
    opportunity.id = this.defaults.id;
    this.dialogRef.close(opportunity);
    this.opportunityService
      .updateOpportunity(opportunity, opportunity.id)
      .subscribe(
        (res) => {
          console.log("opportunity updated sucessfully !");
        },
        (err) => {
          console.log("erreur in updating opportunity !");
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
