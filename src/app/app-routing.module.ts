import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CustomLayoutComponent } from "./custom-layout/custom-layout.component";
import { VexRoutes } from "../@vex/interfaces/vex-route.interface";

const routes: VexRoutes = [
  {
    path: "",
    component: CustomLayoutComponent,
    children: [
      {
        path: "dashboards/analytics",
        redirectTo: "/",
      },
      {
        path: "",
        loadChildren: () =>
          import(
            "./pages/dashboards/dashboard-analytics/dashboard-analytics.module"
          ).then((m) => m.DashboardAnalyticsModule),
      },
      {
        path: "apps",
        children: [
          {
            path: "application",
            loadChildren: () =>
              import("./pages/apps/application/application.module").then(
                (m) => m.ApplicationModule
              ),
          },
          {
            path: "opportunity",
            loadChildren: () =>
              import("./pages/apps/opportunity/opportunity.module").then(
                (m) => m.OpportunityModule
              ),
          },
          {
            path: "contact",
            loadChildren: () =>
              import("./pages/apps/contact/contact.module").then(
                (m) => m.ContactModule
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "corrected",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
