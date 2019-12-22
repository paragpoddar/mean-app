import {
    MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule, MatProgressSpinnerModule, MatDialogModule,
    MatPaginatorModule
} from '@angular/material';
import { NgModule } from '@angular/core';


@NgModule({
    imports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatPaginatorModule
    ],
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatPaginatorModule
    ]
})
export class AngularMaterialModule { }
