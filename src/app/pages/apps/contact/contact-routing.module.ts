import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VexRoutes } from "../../../../@vex/interfaces/vex-route.interface";
import { ContactComponent } from "./contact.component";

const routes: VexRoutes = [
  {
    path: "",
    component: ContactComponent,
    data: {
      toolbarShadowEnabled: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}
