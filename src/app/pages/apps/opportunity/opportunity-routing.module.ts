import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VexRoutes } from "../../../../@vex/interfaces/vex-route.interface";
import { OpportunityComponent } from "./opportunity.component";

const routes: VexRoutes = [
  {
    path: "",
    component: OpportunityComponent,
    data: {
      toolbarShadowEnabled: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AioTableRoutingModule {}
