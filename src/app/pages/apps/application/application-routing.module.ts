import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VexRoutes } from "../../../../@vex/interfaces/vex-route.interface";
import { ApplicationComponent } from "./application.component";

const routes: VexRoutes = [
  {
    path: "",
    component: ApplicationComponent,
    data: {
      toolbarShadowEnabled: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
