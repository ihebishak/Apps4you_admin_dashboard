import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Opportunity } from "../pages/apps/opportunity/interfaces/opportunity.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OpportunityService {
  getAllOpportunities(): Observable<any> {
    return this.http.get("http://localhost:8040/opportunities");
  }
  postOpportunity(data: any) {
    return this.http.post<any>("http://localhost:8040/saveOpportunity", data);
  }

  deleteOpportunity(id: string) {
    return this.http.delete<any>(
      "http://localhost:8040/deleteOpportunity/" + id
    );
  }

  updateOpportunity(opportunity: Opportunity, id: any) {
    return this.http.put<any>(
      "http://localhost:8040/updateOpportunity/" + id,
      opportunity
    );
  }

  constructor(private http: HttpClient) {}
}
