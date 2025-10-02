import { Component, Input } from '@angular/core';
import { CompetenceDTO, CvDTO, ExperienceDTO, LettreDTO } from '../../services/talent.service';


@Component({
  selector: 'app-recapitulatif',
  standalone: false,
  templateUrl: './recapitulatif.component.html',
  styleUrls: ['./recapitulatif.component.css']
})
export class RecapitulatifComponent {
  @Input() candidat: any;
  @Input() competences!: CompetenceDTO[];
  @Input() experiences!: ExperienceDTO[];
  @Input() cv?: CvDTO;
  @Input() lettre?: LettreDTO;
}
