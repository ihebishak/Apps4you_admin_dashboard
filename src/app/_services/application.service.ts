import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Application } from "../pages/apps/application/interfaces/application.model";

@Injectable({
  providedIn: "root",
})
export class ApplicationService {
  getAllApplications(): Observable<any> {
    return this.http.get("http://localhost:8040/clients");
  }
  postApplication(data: any) {
    return this.http.post<any>("http://localhost:8040/saveClient", data);
  }

  deleteApplication(id: string) {
    return this.http.delete<any>("http://localhost:8040/deleteClient/" + id);
  }

  updateApplication(application: Application, id: any) {
    return this.http.put<any>(
      "http://localhost:8040/updateClient/" + id,
      application
    );
  }

  constructor(private http: HttpClient) {}
}
