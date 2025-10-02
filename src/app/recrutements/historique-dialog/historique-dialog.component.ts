import { Component, Inject } from '@angular/core';
import { HistoriqueDTO, ProcessusDTO } from '../../services/talent.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-historique-dialog',
  standalone: false,
  templateUrl: './historique-dialog.component.html',
  styleUrl: './historique-dialog.component.css'
})
export class HistoriqueDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { processus: ProcessusDTO, historique: HistoriqueDTO[] }) {}
}
