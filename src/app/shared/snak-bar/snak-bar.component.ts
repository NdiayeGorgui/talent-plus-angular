import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snak-bar',
  standalone: false,
  templateUrl: './snak-bar.component.html',
  styleUrl: './snak-bar.component.css'
})
export class SnakBarComponent {
constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}

