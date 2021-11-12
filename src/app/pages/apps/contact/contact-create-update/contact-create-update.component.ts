import { ContactService } from "../../../../_services/contact.service";
import icEmail from "@iconify/icons-ic/twotone-mail";
import icSubject from "@iconify/icons-ic/twotone-subject";
import icComment from "@iconify/icons-ic/twotone-comment";
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
import { Contact } from "../interfaces/contact.model";

@Component({
  selector: "vex-contact-create-update",
  templateUrl: "./contact-create-update.component.html",
  styleUrls: ["./contact-create-update.component.scss"],
})
export class ContactCreateUpdateComponent implements OnInit {
  form: FormGroup;
  contact: Contact = new Contact();

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<ContactCreateUpdateComponent>,
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    if (this.defaults) {
      this.mode = "update";
    } else {
      this.defaults = {} as Contact;
    }

    this.form = this.fb.group({
      fullName: this.defaults.fullName,
      email: this.defaults.email,
      subject: this.defaults.subject,
      message: this.defaults.message,
    });
  }

  static id = 100;

  mode: "create" | "update" = "create";

  icMoreVert = icMoreVert;
  icClose = icClose;
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

  save() {
    if (this.mode === "create") {
      this.createContact();
    } else if (this.mode === "update") {
      this.updateContact();
    }
  }

  createContact() {
    this.contact.fullName = this.form.value.fullName;
    this.contact.email = this.form.value.email;
    this.contact.subject = this.form.value.subject;
    this.contact.message = this.form.value.message;
    this.contactService.postContact(this.contact).subscribe(
      (res) => {
        console.log("contact added sucessfully !");
      },
      (err) => {
        console.log("erreur in adding contact !");
      }
    );

    this.dialogRef.close(this.contact);
  }

  updateContact() {
    const contact = this.form.value;
    contact.id = this.defaults.id;
    this.dialogRef.close(contact);
    this.contactService.updateContact(contact, contact.id).subscribe(
      (res) => {
        console.log("contact updated sucessfully !");
      },
      (err) => {
        console.log("erreur in updating contact !");
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
