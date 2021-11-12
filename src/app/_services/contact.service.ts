import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Contact } from "../pages/apps/contact/interfaces/contact.model";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  getAllContacts(): Observable<any> {
    return this.http.get("http://localhost:8040/contacts");
  }
  postContact(data: any) {
    return this.http.post<any>("http://localhost:8040/saveContact", data);
  }

  deleteContact(id: string) {
    return this.http.delete<any>("http://localhost:8040/deleteContact/" + id);
  }

  updateContact(contact: Contact, id: any) {
    return this.http.put<any>(
      "http://localhost:8040/updateContact/" + id,
      contact
    );
  }

  constructor(private http: HttpClient) {}
}
